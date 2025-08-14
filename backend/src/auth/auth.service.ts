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

  /**
   * Sign in with email/password
   * If 2FA is enabled, send OTP and return a temporary token for verification
   */
  async signIn(email: string, password: string): Promise<any> {
    const admin = await this.adminService.findByEmail(email);
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // If 2FA enabled → send OTP & return temp token instead of access token
    if (admin.isTwoFactorEnabled) {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      admin.twoFactorOtp = otpCode;
      admin.twoFactorOtpExpiration = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry
      await this.adminService.updateAdmin(admin);

      await this.adminService.sendTwoFactorCodeEmail(
        admin.twoFactorEmail ?? admin.email, // fallback to account email
        otpCode,
      );

      const tempPayload = { sub: admin.id, twoFactorStage: true };
      const tempToken = await this.jwtService.signAsync(tempPayload, {
        expiresIn: '10m', // expires with OTP
      });

      return {
        twoFactorRequired: true,
        tempToken, // short-lived token for OTP verification
        message: '2FA code sent to your email',
      };
    } else if (!admin.isTwoFactorEnabled) {
      // Otherwise return normal access token
      const payload = { sub: admin.id, email: admin.email, role: admin.role };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }
  }

  /**
   * Verify OTP for admins with 2FA enabled
   * Now uses tempToken from Authorization header instead of asking for adminId
   */
  async verifyTwoFactorCodeFromToken(
    tempToken: string,
    code: string,
  ): Promise<{ access_token: string }> {
    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(tempToken);
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired verification token');
    }

    // Make sure this JWT is from the 2FA stage
    if (!payload.twoFactorStage) {
      throw new UnauthorizedException('Not a valid 2FA flow token');
    }

    const admin = await this.adminService.findById(payload.sub);
    if (!admin || !admin.twoFactorOtp || !admin.twoFactorOtpExpiration) {
      throw new BadRequestException('No pending 2FA verification');
    }

    if (new Date() > admin.twoFactorOtpExpiration) {
      throw new BadRequestException('OTP expired');
    }

    if (admin.twoFactorOtp !== code) {
      throw new BadRequestException('Invalid OTP code');
    }

    // Clear OTP on success
    admin.twoFactorOtp = undefined;
    admin.twoFactorOtpExpiration = undefined;
    await this.adminService.updateAdmin(admin);

    // Issue real login token
    const loginPayload = {
      sub: admin.id,
      email: admin.email,
      role: admin.role,
    };
    return {
      access_token: await this.jwtService.signAsync(loginPayload),
    };
  }
}
