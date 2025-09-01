import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './Dtos/LoginDTO';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Sign in endpoint for admins
  @HttpCode(HttpStatus.OK) // HTTP 200 OK response
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post('admin/login')
  async adminSignIn(@Body() loginDto: LoginDto) {
    return this.authService.signIn(loginDto.email, loginDto.password);
  }


  // Sign in endpoint for customers
  @HttpCode(HttpStatus.OK) // HTTP 200 OK response
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post('customer/login')
  async customerSignIn(@Body() loginDto: LoginDto) {
    return this.authService.signInCustomer(loginDto.email, loginDto.password);
  }


  // Verify two-factor authentication
  @Post('verify-2fa')
  async verify2FA(@Request() req, @Body('code') code: string) {
    const authHeader =
      req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid Authorization header format');
    }

    return this.authService.verifyTwoFactor(token, code);
  }


  // Decode JWT token
  @Post('decode-token')
  async decodeJwtToken(@Body('token') token: string) {
    if (!token) {
      throw new BadRequestException('Token must be provided');
    }
    return this.authService.decodeToken(token);
  }
}
