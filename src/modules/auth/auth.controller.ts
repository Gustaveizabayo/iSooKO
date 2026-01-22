import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Param, Get, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/types/enums';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    @ApiOperation({ summary: 'Login with Google' })
    async googleAuth(@Req() req: any) { }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    @ApiOperation({ summary: 'Google Auth Callback' })
    async googleAuthRedirect(@Req() req: any, @Res() res: any) {
        const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
        const userAgent = req.headers['user-agent'] || 'unknown';
        const result = await this.authService.loginGoogle(req.user, ip, userAgent);
        // For simplicity, return JSON directly or redirect to a frontend with token
        // res.redirect(`http://localhost:3000?token=${result.access_token}`);
        // Since we don't know the frontend URL, returning JSON
        res.status(HttpStatus.OK).json(result);
    }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User registered successfully' })
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login user' })
    async login(@Body() loginDto: LoginDto, @Req() req: any) {
        const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
        const userAgent = req.headers['user-agent'] || 'unknown';
        return this.authService.login(loginDto, ip, userAgent);
    }

    @Post('verify-otp')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Verify OTP' })
    async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
        return this.authService.verifyOtp(verifyOtpDto);
    }

    @Post('resend-otp')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Resend OTP' })
    async resendOtp(@Body() resendOtpDto: ResendOtpDto) {
        return this.authService.resendOtp(resendOtpDto);
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Refresh access token' })
    async refreshToken(@Body() body: { userId: string; refreshToken: string }) {
        return this.authService.refreshAccessToken(body.userId, body.refreshToken);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Logout and revoke refresh token' })
    async logout(@Req() req: any) {
        await this.authService.revokeRefreshToken(req.user.userId);
        return { message: 'Logged out successfully' };
    }

    @Post('apply-instructor')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Apply for instructor role' })
    async applyInstructor(@Body('userId') userId: string) {
        return this.authService.applyInstructor(userId);
    }

    @Post('approve-instructor/:applicationId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Approve instructor application (Admin only)' })
    async approveInstructor(@Param('applicationId') applicationId: string) {
        return this.authService.approveInstructor(applicationId);
    }
}
