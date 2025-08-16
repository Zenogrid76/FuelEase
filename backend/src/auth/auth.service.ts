import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AdminService } from '../admin/admin.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CustomerService } from '../customer/customer.service';


@Injectable()
export class AuthService {
  constructor(
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
    private readonly customerService: CustomerService,
  ) {}

  // Step 1: Sign in, handle 2FA
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
      // Generate OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const salt = await bcrypt.genSalt();
      const hashedOtp = await bcrypt.hash(otpCode, salt);

      // Send OTP via email
      await this.adminService.sendTwoFactorCodeEmail(
        admin.twoFactorEmail ?? admin.email,
        otpCode,
      );

      const twoFaPayload = {
        sub: admin.id,
        otpHash: hashedOtp,
        email: admin.email,
        role: admin.role,
        type: '2fa_temp',
      };

      const tempJwt = await this.jwtService.signAsync(twoFaPayload, {
        expiresIn: '10m',
      });

      return {
        twoFactorRequired: true,
        tempToken: tempJwt,
        message: '2FA code sent to your email',
      };
    } else {
      // No 2FA: issue main access token immediately
      const payload = { sub: admin.id, email: admin.email, role: admin.role };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }
  }

  // Step 2: Verify OTP and issue access token
  async verifyTwoFactor(
    tempToken: string,
    code: string,
  ): Promise<{ access_token: string }> {
    // Decode/verify temp JWT
    let decoded: any;
    try {
      decoded = await this.jwtService.verifyAsync(tempToken);
    } catch (err) {
      throw new UnauthorizedException('2FA token invalid or expired');
    }

    // Validate OTP
    if (!code || !decoded.otpHash) {
      throw new BadRequestException('Missing code or 2FA data');
    }

    const isOtpValid = await bcrypt.compare(code, decoded.otpHash);
    if (!isOtpValid) {
      throw new BadRequestException('Invalid OTP code');
    }

    // OTP is valid, issue main access token
    const payload = {
      sub: decoded.sub,
      email: decoded.email,
      role: decoded.role,
      type: 'access', // Normal access token
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  // Utility for decoding tokens (optional)
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



  // Customer sign-in with 2FA
  async signInCustomer(email: string, password: string): Promise<any> {
    const customer = await this.customerService.findByEmail(email);
    if (!customer) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (customer.isTwoFactorEnabled) {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const salt = await bcrypt.genSalt();
      const hashedOtp = await bcrypt.hash(otpCode, salt);

      await this.customerService.sendTwoFactorCodeEmail(
        customer.twoFactorEmail ?? customer.email,
        otpCode,
      );

      const twoFaPayload = {
        sub: customer.id,
        otpHash: hashedOtp,
        email: customer.email,
        role: customer.role,
        type: '2fa_temp',
      };

      const tempJwt = await this.jwtService.signAsync(twoFaPayload, { expiresIn: '10m' });

      return {
        twoFactorRequired: true,
        tempToken: tempJwt,
        message: '2FA code sent to your email',
      };
    } else {
      const payload = { sub: customer.id, email: customer.email, role: customer.role };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }
  }

  
}
