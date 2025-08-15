import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository} from 'typeorm';
import { Customer } from './customer.entity';
import { CustomerDto } from './dtos/customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}
/*
  // Signup new customer
  async signup(customerDto: CustomerDto): Promise<Customer> {
    // TODO: hash password, validate, save to DB
    //return null;
  }

  // Update profile info by customer ID
  async updateProfile(customerId: number, updateDto: Partial<CustomerDto>): Promise<Customer> {
    // TODO: find, update fields, save
    //return null;
  }

  // Delete account by customer ID
  async deleteAccount(customerId: number): Promise<{ deleted: boolean }> {
    // TODO: delete customer by id
    return { deleted: false };
  }

  // Search stations (stub method)
  async searchStation(query: string): Promise<any[]> {
    // TODO: implement searching stations by name/location etc
    return [];
  }

  // Pay for fuel or booking
  async pay(customerId: number, paymentDetails: any): Promise<any> {
    // TODO: implement payment logic
    return {};
  }

  // Post a review
  async postReview(customerId: number, stationId: number, reviewDetails: any): Promise<any> {
    // TODO: implement review creation
    return {};
  }
    */
}
