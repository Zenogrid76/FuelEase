import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { LoginDto } from './Dtos/LoginDTO';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post('login')
  signIn(@Body() loginDto: LoginDto) {
    return this.authService.signIn(loginDto.email, loginDto.password);
  }

  @Post('verify-2fa')
  async verify2FA(@Req() req, @Body('code') code: string) {
    const authHeader = req.headers['authorization'];
    if (!authHeader)
      throw new UnauthorizedException('Missing Authorization header');
    const tempToken = authHeader.split(' ')[1];

    return this.authService.verifyTwoFactorCodeFromToken(tempToken, code);
  }

  @Post('decode-token')
  async decodeJwtToken(@Body('token') token: string) {
    if (!token) {
      throw new BadRequestException('Token must be provided');
    }
    return this.authService.decodeToken(token);
  }
}
