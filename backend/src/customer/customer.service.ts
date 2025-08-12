import { Injectable, NotFoundException } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { CustomerDto } from './dtos/customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async createCustomer(createCustomerDto: CustomerDto): Promise<Customer> {
    const customer = this.customerRepository.create(createCustomerDto);
    return this.customerRepository.save(customer);
  }

  async findByUsername(username: string): Promise<Customer> {
    const customer = await this.customerRepository.findOneBy({ username });
    if (!customer) {
      throw new NotFoundException(
        `Customer with username ${username} not found`,
      );
    }
    return customer;
  }

  async findByFullNameContains(substring: string): Promise<Customer[]> {
    return this.customerRepository.find({
      where: {
        fullName: ILike(`%${substring}%`),
      },
    });
  }

  async removeByUsername(username: string): Promise<{ deleted: boolean }> {
    const result = await this.customerRepository.delete({ username });
    return { deleted: !!result.affected };
  }

    // Make isActive true for a given customer id
  async activateCustomer(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({ where: { id } });

    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    customer.isActive = true; 
    return this.customerRepository.save(customer);
  }
}
