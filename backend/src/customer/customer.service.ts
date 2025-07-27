import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { CustomerDto } from './dtos/customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
  ) {}

  async createCustomer(dto: CustomerDto): Promise<Customer> {
    const customer = this.customerRepo.create(dto);
    return this.customerRepo.save(customer);
  }

  async updatePdfFile(id: number, filePath: string): Promise<Customer> {
    const customer = await this.customerRepo.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    customer.pdfFile = filePath;
    return this.customerRepo.save(customer);
  }

  async deleteCustomer(id: number): Promise<{ message: string }> {
    const result = await this.customerRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Customer not found');
    }
    return { message: 'Customer deleted successfully' };
  }
}
