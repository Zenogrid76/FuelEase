import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AdminService } from '../admin/admin.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string): Promise<any> {
    const admin = await this.adminService.findByEmail(email);
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (admin.isTwoFactorEnabled) {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      admin.twoFactorOtp = otpCode;
      admin.twoFactorOtpExpiration = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry
      await this.adminService.updateAdmin(admin);

      await this.adminService.sendTwoFactorCodeEmail(admin.email, otpCode);

      // Return response indicating 2FA verification required
      return {
        twoFactorRequired: true,
        message: '2FA code sent to your email',
      };
    }

    // No 2FA, return JWT as usual
    const payload = { sub: admin.id, email: admin.email, role: admin.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async verifyTwoFactorCode(
    adminId: number,
    code: string,
  ): Promise<{ access_token: string }> {
    const admin = await this.adminService.findById(adminId);
    if (!admin || !admin.twoFactorOtp || !admin.twoFactorOtpExpiration) {
      throw new BadRequestException('2FA not set up or code expired');
    }

    if (admin.twoFactorOtp !== code) {
      throw new BadRequestException('Invalid 2FA code');
    }

    if (new Date() > admin.twoFactorOtpExpiration) {
      throw new BadRequestException('2FA code expired');
    }

    // Clear OTP fields after successful verification
    admin.twoFactorOtp = undefined;
    admin.twoFactorOtpExpiration = undefined;

    await this.adminService.updateAdmin(admin); // Use a method in AdminService to save admin

    // Generate and return JWT token
    const payload = { sub: admin.id, email: admin.email, role: admin.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
