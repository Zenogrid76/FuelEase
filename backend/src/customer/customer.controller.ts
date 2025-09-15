import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Delete,
  Patch,
  UseGuards,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  Request,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { AuthGuard, CustomerGuard } from '../auth/auth.guard';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  // Sign up endpoint for customers
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @Post('signup')
  async signup(@Body() customerDto: any) {
    return this.customerService.signup(customerDto);
  }

  // Enable 2FA for logged-in customer
  @UseGuards(AuthGuard, CustomerGuard)
  @Post('enable-2fa')
  async enableTwoFactor(
    @Request() req,
    @Body('emailForOtp') emailForOtp: string,
  ) {
    if (!emailForOtp) {
      throw new BadRequestException('Email for OTP is required');
    }
    const customerId = req.user.sub;
    const customer = await this.customerService.findById(customerId);
    if (customer.isTwoFactorEnabled) {
      throw new BadRequestException(
        `Two-factor authentication is already enabled with this email 
        ${customer.twoFactorEmail}`,
      );
    }

    return this.customerService.enableTwoFactor(customerId, emailForOtp);
  }

  // Verify 2FA setup for logged-in customer
  @UseGuards(AuthGuard, CustomerGuard)
  @Post('verify-2fa-setup')
  async verifyTwoFactorSetup(@Request() req, @Body('code') code: string) {
    if (!code) {
      throw new BadRequestException('OTP code is required');
    }
    const customerId = req.user.sub;
    return this.customerService.verifyTwoFactorSetup(customerId, code);
  }

  // Get own profile 
  @UseGuards(AuthGuard, CustomerGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const customerId = req.user.sub;
    return this.customerService.findById(customerId);
  }

  // Update own profile 
  @UseGuards(AuthGuard, CustomerGuard)
  @Put('profile')
  async updateProfile(@Request() req, @Body() updateDto: Partial<any>) {
    const customerId = req.user.sub;
    return this.customerService.updateProfile(customerId, updateDto);
  }

  // Delete own account 
  @UseGuards(AuthGuard, CustomerGuard)
  @Delete('delete')
  async deleteAccount(@Request() req) {
    const customerId = req.user.sub;
    return this.customerService.deleteAccount(customerId);
  }
}
