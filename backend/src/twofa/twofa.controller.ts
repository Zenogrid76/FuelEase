import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { TwoFactorAuthService } from './twofa.service';
import { AdminService } from '../admin/admin.service';

@Controller('twofactor')
export class TwoFactorAuthController {
  constructor(
    private readonly twoFactorAuthService: TwoFactorAuthService,
    private readonly adminService: AdminService
  ) {}

  // Send OTP
  @Post('send-code')
  async sendCode(@Body('email') email: string) {
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    const admin = await this.adminService.findByEmail(email); // find admin
    if (!admin) {
      throw new BadRequestException('Admin not found');
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP and expiration in DB
    admin.twoFactorOtp = otpCode;
    admin.twoFactorOtpExpiration = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    await this.adminService.updateAdmin(admin);

    // Send OTP via email
    await this.twoFactorAuthService.sendTwoFactorCode(email, otpCode);

    return { message: '2FA code sent to your email' };
  }

  // Verify OTP
  @Post('verify-code')
  async verifyCode(@Body() body: { email: string; code: string }) {
    const { email, code } = body;
    if (!email || !code) {
      throw new BadRequestException('Email and code are required');
    }

    const admin = await this.adminService.findByEmail(email);
    if (!admin || !admin.twoFactorOtp || !admin.twoFactorOtpExpiration) {
      throw new BadRequestException('No pending 2FA verification');
    }

    if (new Date() > admin.twoFactorOtpExpiration) {
      throw new BadRequestException('OTP expired');
    }

    if (admin.twoFactorOtp !== code) {
      throw new BadRequestException('Invalid OTP code');
    }

    // ✅ Clear OTP on success
    admin.twoFactorOtp = undefined;
    admin.twoFactorOtpExpiration = undefined;
    await this.adminService.updateAdmin(admin);

    return { message: '2FA verification successful' };
  }
}
