import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { CustomerDto } from './dtos/customer.dto';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly mailerService: MailerService,
  ) {}

  // Signup new customer
  async signup(customerDto: CustomerDto): Promise<Customer> {
    const existing = await this.customerRepository.findOne({
      where: { email: customerDto.email },
    });
    if (existing) {
      throw new BadRequestException('Email already in use');
    }
    const existingPhone = await this.customerRepository.findOne({
      where: { phoneNo: customerDto.phoneNo },
    });
    if (existingPhone) {
      throw new BadRequestException('Phone number already in use');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(customerDto.password, salt);

    const customer = this.customerRepository.create({
      ...customerDto,
      password: hashedPassword,
      role: 'customer',
      isTwoFactorEnabled: false,
    });

    // Send welcome email
    await this.mailerService.sendMail({
      to: customerDto.email,
      subject: 'Welcome to Fuelease - Your Account Has Been Created',
      html: `
      <p>Thank you for joining Fuelease as a Customer.</p>
      <p>Your account has been created.</p>
      <p>We hope you enjoy your time here.</p>
    `,
    });

    return await this.customerRepository.save(customer);
  }

  // Update profile info by customer ID
  async updateProfile(
    customerId: number,
    updateDto: Partial<CustomerDto>,
  ): Promise<Customer> {
    const customer = await this.findById(customerId);
    Object.assign(customer, updateDto);
    return await this.customerRepository.save(customer);
  }

  async deleteAccount(customerId: number): Promise<{ deleted: boolean }> {
    const result = await this.customerRepository.delete(customerId);
    return { deleted: !!result.affected };
  }

  /*  // Search stations (stub method)
  async searchStation(query: string): Promise<any[]> {
    // TODO: implement full-text search or external service integration
    return [];
  }
*/

  // Find customer by email
  async findByEmail(email: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { email },
      select: [
        'id',
        'email',
        'password',
        'role',
        'twoFactorEmail',
        'twoFactorOtp',
        'twoFactorOtpExpiration',
        'isTwoFactorEnabled',
      ],
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  // Find customer by ID
  async findById(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id },
      select: [
        'id',
        'email',
        'role',
        'twoFactorEmail',
        'twoFactorOtp',
        'twoFactorOtpExpiration',
        'isTwoFactorEnabled',
      ],
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  // Enable two-factor authentication for a customer
  async enableTwoFactor(
    customerId: number,
    emailForOtp: string,
  ): Promise<{ message: string }> {
    const customer = await this.findById(customerId);
    if (!customer) throw new BadRequestException('Customer not found');

    // Save the OTP email in the database
    customer.twoFactorEmail = emailForOtp;

    // Generate 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash the OTP before storing
    const salt = await bcrypt.genSalt();
    const hashedOtp = await bcrypt.hash(otpCode, salt);

    customer.twoFactorOtp = hashedOtp;
    customer.twoFactorOtpExpiration = new Date(Date.now() + 10 * 60 * 1000);

    // Mark 2FA as pending activation (enable only after verification)
    customer.isTwoFactorEnabled = false;

    await this.customerRepository.save(customer);

    // Send OTP setup code to the provided email
    await this.mailerService.sendMail({
      to: emailForOtp,
      subject: 'Your 2FA Setup Code',
      text: `Your two-factor authentication setup code is ${otpCode}`,
      html: `<b>Your two-factor authentication setup code is: ${otpCode}</b>`,
    });

    return { message: '2FA code sent to the provided email' };
  }

  // Send 2FA login code email to customer
  async sendTwoFactorCodeEmail(to: string, otpCode: string): Promise<void> {
    await this.mailerService.sendMail({
      to,
      subject: 'Your 2FA Login Code',
      text: `Your two-factor authentication code is ${otpCode}`,
      html: `<b>Your two-factor authentication code is: ${otpCode}</b>`,
    });
  }

  // Verify 2FA setup code for customer
  async verifyTwoFactorSetup(
    customerId: number,
    code: string,
  ): Promise<{ message: string }> {
    const customer = await this.findById(customerId);
    if (
      !customer ||
      !customer.twoFactorOtp ||
      !customer.twoFactorOtpExpiration
    ) {
      throw new BadRequestException('No pending 2FA setup verification');
    }

    if (new Date() > customer.twoFactorOtpExpiration) {
      throw new BadRequestException('OTP code expired');
    }

    if (!(await bcrypt.compare(code, customer.twoFactorOtp))) {
      throw new BadRequestException('Invalid OTP code');
    }

    // Clear OTP fields, confirm 2FA enabled
    customer.twoFactorOtp = undefined;
    customer.twoFactorOtpExpiration = undefined;
    customer.isTwoFactorEnabled = true;

    await this.customerRepository.save(customer);

    return { message: '2FA has been successfully enabled' };
  }
}
