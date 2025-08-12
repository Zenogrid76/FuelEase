import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Admin } from './admin.entity';
import { AdminDto } from './dtos/admin.dto';
import { QueryFailedError } from 'typeorm/error/QueryFailedError';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly mailerService: MailerService,
  ) {}

async createAdmin(adminDto: AdminDto) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(adminDto.password, saltOrRounds);

    const newAdmin = this.adminRepository.create({
      ...adminDto,
      password: hash, // store hashed password instead of plain
    });

    return this.adminRepository.save(newAdmin);
  }

  async updateAdmin(admin: Admin): Promise<Admin> {
  return this.adminRepository.save(admin);
}

  // Change the status of a user
  async updateStatus(
    id: number,
    status: 'active' | 'inactive',
  ): Promise<Admin> {
    if (status !== 'active' && status !== 'inactive') {
      throw new BadRequestException(
        'Status must be either "active" or "inactive"',
      );
    }
    const admin = await this.adminRepository.findOneBy({ id });
    if (!admin) throw new NotFoundException('Admin not found');
    admin.status = status;
    return this.adminRepository.save(admin);
  }

  // Retrieve a list of users based on their 'inactve' status
  async findInactiveUsers(): Promise<Admin[]> {
    return this.adminRepository.find({ where: { status: 'inactive' } });
  }

  // Get a list of users older than a given age
  async findUsersOlderThan(age: number): Promise<Admin[]> {
    return this.adminRepository.find({
      where: {
        age: MoreThan(age),
      },
    });
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
  const admin = await this.adminRepository.findOne({
    where: { email },
    select: ['id', 'email', 'password', 'role'],
  });
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

  async enableTwoFactor(adminId: number, emailForOtp: string): Promise<{ message: string }> {
    const admin = await this.findById(adminId);
    if (!admin) throw new BadRequestException('Admin not found');

    // Generate 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP and expiration (e.g., 10 minutes from now)
    admin.twoFactorOtp = otpCode;
    admin.twoFactorOtpExpiration = new Date(Date.now() + 10 * 60 * 1000);
    admin.isTwoFactorEnabled = true; // mark 2FA enabled

    await this.adminRepository.save(admin);

    // Send OTP code to the provided email (not necessarily admin.email)
    await this.mailerService.sendMail({
      to: emailForOtp,
      subject: 'Your 2FA Setup Code',
      text: `Your two-factor authentication setup code is ${otpCode}`,
      html: `<b>Your two-factor authentication setup code is: ${otpCode}</b>`,
    });

    return { message: '2FA code sent to the provided email' };
  }

  async sendTwoFactorCodeEmail(to: string, otpCode: string): Promise<void> {
  await this.mailerService.sendMail({
    to,
    subject: 'Your 2FA Login Code',
    text: `Your two-factor authentication code is ${otpCode}`,
    html: `<b>Your two-factor authentication code is: ${otpCode}</b>`,
  });
}

}
