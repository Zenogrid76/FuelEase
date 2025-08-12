import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerDto } from './dtos/customer.dto';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  //localhost:3000/customers/create
  @Post('create')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createCustomer(@Body() createCustomerDto: CustomerDto) {
    return this.customerService.createCustomer(createCustomerDto);
  }

  //localhost:3000/customers/username/:username
  @Get('username/:username')
  async getCustomerByUsername(@Param('username') username: string) {
    return this.customerService.findByUsername(username);
  }

  //localhost:3000/customers/search/:substring
  @Get('search/:substring')
  async getCustomersByFullNameSubstring(@Param('substring') substring: string) {
    return this.customerService.findByFullNameContains(substring);
  }

  //localhost:3000/customers/username/:username
  @Delete('username/:username')
  async deleteCustomerByUsername(@Param('username') username: string) {
    return this.customerService.removeByUsername(username);
  }

  
  // localhost:3000/customers/activate/:id
  @Patch('activate/:id')
  async activateCustomer(@Param('id', ParseIntPipe) id: number) {
    return this.customerService.activateCustomer(id);
  }
}
