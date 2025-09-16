import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
 
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './LoginDTO';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post('operator/login')
  async operatorSignIn(@Body() loginDto: LoginDto) {
    
    return this.authService.signIn(loginDto.email, loginDto.password);
    
  }

  @Post('decode-token')
  async decodeJwtToken(@Body('token') token: string) {
    if (!token) {
      throw new BadRequestException('Token must be provided');
    }
    return this.authService.decodeToken(token);
  }
}