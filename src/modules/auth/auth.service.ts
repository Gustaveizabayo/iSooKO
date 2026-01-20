import { Injectable, ConflictException, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../database/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { OtpService } from './otp.service';
import { EmailService } from '../../utils/email.service';
import { UserStatus, UserRole } from '../../common/types/enums';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private otpService: OtpService,
    private emailService: EmailService,
  ) { }

  async validateGoogleUser(details: any) {
    const { email, firstName, lastName, googleId } = details;

    // Check by googleId
    let user = await this.prisma.user.findUnique({
      where: { googleId },
    });

    if (user) return user;

    // Check by email
    user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      // Link Google ID
      return this.prisma.user.update({
        where: { id: user.id },
        data: { googleId, status: UserStatus.ACTIVE }, // Ensure active if verifying via Google
      });
    }

    // Create new user
    return this.prisma.user.create({
      data: {
        email,
        name: `${firstName} ${lastName}`,
        googleId,
        password: '', // No password for Google users
        role: UserRole.STUDENT,
        status: UserStatus.ACTIVE,
      },
    });
  }

  async loginGoogle(user: any) {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    const token = this.jwtService.sign(payload);

    // Generate refresh token with rotation (invalidate old one)
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Store new refresh token (invalidates old one)
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return {
      access_token: token,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async refreshAccessToken(userId: string, oldRefreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.refreshToken !== oldRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Generate new tokens (rotation)
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    const newAccessToken = this.jwtService.sign(payload);
    const newRefreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Update stored refresh token
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: newRefreshToken },
    });

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    };
  }

  async revokeRefreshToken(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }


  async register(registerDto: RegisterDto) {
    const { email, password, name, role } = registerDto;

    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with PENDING status
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || UserRole.STUDENT,
        status: UserStatus.PENDING,
      },
    });

    // Generate and send OTP
    const otp = await this.otpService.generateOtp(user.id);
    await this.emailService.sendOtpEmailDirect(user.email, otp.code);

    return {
      message: 'Registration successful. Please verify your email.',
      userId: user.id,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status === UserStatus.PENDING) {
      throw new UnauthorizedException('Please verify your email first');
    }

    if (user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedException('Account is suspended');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { email, otpCode } = verifyOtpDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.status !== UserStatus.PENDING) {
      throw new BadRequestException('User already verified');
    }

    const isValid = await this.otpService.verifyOtp(user.id, otpCode);
    if (!isValid) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Update user status to ACTIVE
    await this.prisma.user.update({
      where: { id: user.id },
      data: { status: UserStatus.ACTIVE },
    });

    return { message: 'Email verified successfully' };
  }

  async resendOtp(resendOtpDto: ResendOtpDto) {
    const { email } = resendOtpDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.status !== UserStatus.PENDING) {
      throw new BadRequestException('User already verified');
    }

    // Generate new OTP
    const otp = await this.otpService.generateOtp(user.id);
    await this.emailService.sendOtpEmailDirect(user.email, otp.code);

    return { message: 'OTP sent successfully' };
  }

  async applyInstructor(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== UserRole.STUDENT) {
      throw new BadRequestException('Only students can apply for instructor role');
    }

    const existingApplication = await this.prisma.instructorApplication.findFirst({
      where: { userId, status: 'PENDING' },
    });

    if (existingApplication) {
      throw new BadRequestException('You already have a pending application');
    }

    const application = await this.prisma.instructorApplication.create({
      data: {
        userId,
        status: 'PENDING',
        bio: 'No bio provided',
        qualifications: 'No qualifications provided',
        experience: 'No experience provided',
      },
    });

    return {
      message: 'Instructor application submitted successfully',
      applicationId: application.id,
    };
  }

  async approveInstructor(applicationId: string) {
    const application = await this.prisma.instructorApplication.findUnique({
      where: { id: applicationId },
      include: { user: true },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.status !== 'PENDING') {
      throw new BadRequestException('Application already processed');
    }

    // Update user role
    await this.prisma.user.update({
      where: { id: application.userId },
      data: { role: UserRole.INSTRUCTOR },
    });

    // Update application status
    await this.prisma.instructorApplication.update({
      where: { id: applicationId },
      data: { status: 'APPROVED' },
    });

    return { message: 'Instructor application approved successfully' };
  }
}