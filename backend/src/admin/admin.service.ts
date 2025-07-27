import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';
import { AdminDto } from './dtos/admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>) {}


async createAdmin(AdminDto: AdminDto): Promise<Admin> {
  const { email } = AdminDto;

  if (!email.toLowerCase().endsWith('.xyz')) {
    throw new BadRequestException('Email must be a valid address ending with .xyz');
  }

  const newAdmin = this.adminRepository.create(AdminDto);
  return this.adminRepository.save(newAdmin);
}


  async updateProfileImage(id: number, filePath: string): Promise<Admin> {
    const admin = await this.adminRepository.findOneBy({ id });
    if (!admin) throw new NotFoundException('Admin not found');
    admin.profileImage = filePath;
    return this.adminRepository.save(admin);
  }

  async updateNidImage(id: number, filePath: string): Promise<Admin> {
    const admin = await this.adminRepository.findOneBy({ id });
    if (!admin) throw new NotFoundException('Admin not found');
    admin.nidImage = filePath;
    return this.adminRepository.save(admin);
  }

  async deleteAdmin(id: number): Promise<{ deleted: boolean }> {
    const result = await this.adminRepository.delete({ id });
    return { deleted: !!result.affected };
  }

async findByEmail(email: string): Promise<Admin> {
  const admin = await this.adminRepository.findOneBy({ email });
  if (!admin) {
    throw new NotFoundException('Admin not found');
  }
  return admin;
}

async findById(id: number): Promise<Admin> {
  const admin = await this.adminRepository.findOneBy({ id });
  if (!admin) {
    throw new NotFoundException('Admin not found');
  }
  return admin;
}

}