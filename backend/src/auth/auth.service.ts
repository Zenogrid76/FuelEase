import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AdminService } from '../admin/admin.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as session from 'express-session';


@Injectable()
export class AuthService {
  constructor(
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string, req: any): Promise<any> {
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

      const salt = await bcrypt.genSalt();

      const hashedOtp = await bcrypt.hash(otpCode, salt);

      admin.twoFactorOtp = hashedOtp;
      admin.twoFactorOtpExpiration = new Date(Date.now() + 10 * 60 * 1000);
      await this.adminService.updateAdmin(admin);

      await this.adminService.sendTwoFactorCodeEmail(
        admin.twoFactorEmail ?? admin.email,
        otpCode,
      );

      const tempToken = Array.from({ length: 12 }, () =>
        Math.floor(Math.random() * 10),
      ).join('');

      req.session.tempToken = tempToken;
      req.session.adminIdFor2FA = admin.id;
      req.session.otpExpiration = admin.twoFactorOtpExpiration;

      return {
        twoFactorRequired: true,
        tempToken,
        message: '2FA code sent to your email',
      };
    } else {
      const payload = { sub: admin.id, email: admin.email, role: admin.role };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }
  }

  // New method for verifying the 2FA OTP using session
  async verifyTwoFactor(
    req: any,
    code: string,
  ): Promise<{ access_token: string }> {
    const { tempToken, adminIdFor2FA, otpExpiration } = req.session;

    if (!tempToken || !adminIdFor2FA) {
      throw new UnauthorizedException('No pending 2FA session');
    }

    if (new Date() > new Date(otpExpiration)) {
      throw new BadRequestException('OTP expired');
    }

    const admin = await this.adminService.findById(adminIdFor2FA);

    if (!admin || !admin.twoFactorOtp) {
      throw new BadRequestException('No pending 2FA OTP');
    }

    if (!(await bcrypt.compare(code, admin.twoFactorOtp))) {
      throw new BadRequestException('Invalid OTP code');
    }

    // Clear OTP and session data after successful verification
    admin.twoFactorOtp = undefined;
    admin.twoFactorOtpExpiration = undefined;
    await this.adminService.updateAdmin(admin);

    req.session.tempToken = null;
    req.session.adminIdFor2FA = null;
    req.session.otpExpiration = null;
   

    const payload = { sub: admin.id, email: admin.email, role: admin.role };
    return {
      
      access_token: await this.jwtService.signAsync(payload),
    };
    
  }

  async decodeToken(token: string): Promise<any> {
    try {
      const decoded = this.jwtService.decode(token, { json: true });
      if (!decoded) {
        throw new BadRequestException('Invalid JWT token format');
      }
      return { decoded };
    } catch (error) {
      throw new BadRequestException('Failed to decode token');
    }
  }
}
