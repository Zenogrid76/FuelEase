import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Request,
  UnauthorizedException,
  Res,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './Dtos/LoginDTO';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('admin/login')
  async adminSignIn(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.signIn(
      loginDto.email,
      loginDto.password,
    );

    if (result.access_token) {
      res.cookie('jwt', result.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // false for local dev
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      return { message: 'Login successful' };
    } else if (result.twoFactorRequired) {
      return result; // Keep 2FA flow as is
    } else {
      throw new UnauthorizedException('Invalid login response');
    }
  }

  @Post('customer/login')
  async customerSignIn(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.signInCustomer(
      loginDto.email,
      loginDto.password,
    );

    if (result.access_token) {
      res.cookie('jwt', result.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return { message: 'Login successful' };
    } else if (result.twoFactorRequired) {
      return result;
    } else {
      throw new UnauthorizedException('Invalid login response');
    }
  }

@Post('verify-2fa')
async verify2FA(
  @Request() req,
  @Res({ passthrough: true }) res: Response,
  @Body('code') code: string,
) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader) {
    throw new UnauthorizedException('Authorization header missing');
  }

  const [type, tempToken] = authHeader.split(' ');
  if (type !== 'Bearer' || !tempToken) {
    throw new UnauthorizedException('Invalid Authorization header format');
  }

  // Call your service to verify 2FA and get access token
  const result = await this.authService.verifyTwoFactor(tempToken, code);

  // Set access token in HttpOnly cookie
  res.cookie('jwt', result.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return { message: 'Two-factor authentication successful' };
}


  @Post('decode-token')
  async decodeJwtToken(@Body('token') token: string) {
    if (!token) {
      throw new BadRequestException('Token must be provided');
    }
    return this.authService.decodeToken(token);
  }

   @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', 
    });
    return { message: 'Logged out successfully' };
  }
}
