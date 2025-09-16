// src/auth/auth.service.ts
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { OperatorService } from 'src/operator/operator.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly operatorService: OperatorService,
    private readonly jwtService: JwtService,
  ) {}

  // Sign in without 2FA
  async signIn(email: string, password: string): Promise<any> {
    const operator = await this.operatorService.findByEmail(email);
    if (!operator) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, operator.password);
    if (!isMatch) {
      throw new UnauthorizedException('Operator Does not exist');
    }

    // Update last login
    operator.lastLogin = new Date();
    await this.operatorService.updateOperatorData(operator.id, {
      lastLogin: operator.lastLogin,
    });

    const payload = { sub: operator.id, type: 'access' };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  // Utility for decoding tokens
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
