import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';
import { AdminDto } from './dtos/admin.dto';
import { QueryFailedError } from 'typeorm/error/QueryFailedError';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  // Create a user
  async createAdmin(adminDto: AdminDto): Promise<Admin> {

    const newAdmin = this.adminRepository.create(adminDto);

    try {
      return await this.adminRepository.save(newAdmin);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.driverError?.code === '23505'
      ) {
        const detail = error.driverError.detail?.toLowerCase() ?? '';
        if (detail.includes('phoneNo'.toLowerCase())) {
          throw new BadRequestException('Phone number already exists.');
        }
        if (detail.includes('nidNumber'.toLowerCase())) {
          throw new BadRequestException('NID number already exists.');
        }
        if (detail.includes('email'.toLowerCase())) {
          throw new BadRequestException('Email already exists.');
        }
        throw new BadRequestException(
          'Duplicate entry violates unique constraint.',
        );
      }
      throw error;
    }
  }

  // Change the status of a user
  async updateStatus(id: number, status: 'actve' | 'inactve'): Promise<Admin> {
    if (status !== 'actve' && status !== 'inactve') {
      throw new BadRequestException(
        'Status must be either "actve" or "inactve"',
      );
    }
    const admin = await this.adminRepository.findOneBy({ id });
    if (!admin) throw new NotFoundException('Admin not found');
    admin.status = status;
    return this.adminRepository.save(admin);
  }

  // Retrieve a list of users based on their 'inactve' status
  async findInactiveUsers(): Promise<Admin[]> {
    return this.adminRepository.find({ where: { status: 'inactve' } });
  }

  // Get a list of users older than 40
  // Get a list of users older than a given age
  async findUsersOlderThan(age: number): Promise<Admin[]> {
    return this.adminRepository
      .createQueryBuilder('admin')
      .where('admin.age > :age', { age })
      .getMany();
  }

  // Update profile image and NID image
  async updateProfileImage(id: number, filePath: string): Promise<Admin> {
    const admin = await this.adminRepository.findOneBy({ id });
    if (!admin) throw new NotFoundException('Admin not found');
    admin.profileImage = filePath;
    return this.adminRepository.save(admin);
  }

  // Update NID image
  async updateNidImage(id: number, filePath: string): Promise<Admin> {
    const admin = await this.adminRepository.findOneBy({ id });
    if (!admin) throw new NotFoundException('Admin not found');
    admin.nidImage = filePath;
    return this.adminRepository.save(admin);
  }

  // Update admin details
  async deleteAdmin(id: number): Promise<{ deleted: boolean }> {
    const result = await this.adminRepository.delete({ id });
    return { deleted: !!result.affected };
  }

  // Find admin by email or ID
  async findByEmail(email: string): Promise<Admin> {
    const admin = await this.adminRepository.findOneBy({ email });
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }
    return admin;
  }

  // Find admin by ID
  async findById(id: number): Promise<Admin> {
    const admin = await this.adminRepository.findOneBy({ id });
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }
    return admin;
  }
}
