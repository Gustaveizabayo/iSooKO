import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class OtpService {
  constructor(private prisma: PrismaService) {}

  async generateOtp(userId: string): Promise<{ code: string; expiresAt: Date }> {
    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete existing OTP for this user
    await this.prisma.oTP.deleteMany({
      where: { userId },
    });

    // Create new OTP
    await this.prisma.oTP.create({
      data: {
        userId,
        code,
        expiresAt,
      },
    });

    return { code, expiresAt };
  }

  async verifyOtp(userId: string, code: string): Promise<boolean> {
    const otp = await this.prisma.oTP.findUnique({
      where: { userId },
    });

    if (!otp) {
      return false;
    }

    // Check if OTP matches and is not expired
    if (otp.code !== code || otp.expiresAt < new Date()) {
      // Delete expired or incorrect OTP
      await this.prisma.oTP.delete({
        where: { userId },
      });
      return false;
    }

    // Delete used OTP
    await this.prisma.oTP.delete({
      where: { userId },
    });

    return true;
  }
}