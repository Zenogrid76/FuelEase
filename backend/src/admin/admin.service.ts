import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Admin } from './admin.entity';
import { AdminDto } from './dtos/admin.dto';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly mailerService: MailerService,
  ) {}



/*
  // Create a new admin
  // This method is used by existing admins to create new admins
  // It hashes the password and sends a welcome email
  async createAdmin(
    adminDto: AdminDto,
    creatorFullName: string,
  ): Promise<Admin> {
    const existingAdmin = await this.adminRepository.findOne({
      where: [
        { email: adminDto.email },
        { nidNumber: adminDto.nidNumber },
        { phoneNo: adminDto.phoneNo },
      ],
    });

    if (existingAdmin) {
      if (existingAdmin.email === adminDto.email) {
        throw new BadRequestException('Email already exists');
      }
      if (existingAdmin.nidNumber === adminDto.nidNumber) {
        throw new BadRequestException('NID number already exists');
      }
      if (existingAdmin.phoneNo === adminDto.phoneNo) {
        throw new BadRequestException('Phone number already exists');
      }
    }
    const salt = await bcrypt.genSalt();

    const hash = await bcrypt.hash(adminDto.password, salt);

    const newAdmin = this.adminRepository.create({
      ...adminDto,
      password: hash,
    });

    const savedAdmin = await this.adminRepository.save(newAdmin);

    await this.mailerService.sendMail({
      to: adminDto.email,
      subject: 'Welcome to Fuelease - Your Admin Account Created',
      html: `
      <p>Thank you for joining Fuelease as an Admin.</p>
      <p>Your account has been created by <b>${creatorFullName}</b>.</p>
      <p>We hope you enjoy your time here.</p>
      <p>Your current email: <b>${adminDto.email}</b></p>
      <p>Your temporary password: <b>${adminDto.password}</b></p>
      <p>Please change your password on first login if you want.</p>
    `,
    });

    return savedAdmin;
  }
*/
  
  // Create a new admin without creator info
  // This method is used for the first admin creation
  async createAdmin(adminDto: AdminDto) {
   const existingAdmin = await this.adminRepository.findOne({
    where: [
      { email: adminDto.email },
      { nidNumber: adminDto.nidNumber },
      { phoneNo: adminDto.phoneNo },
    ],
  });

  if (existingAdmin) {
    // Determine which field already exists
    if (existingAdmin.email === adminDto.email) {
      throw new BadRequestException('Email already exists');
    }
    if (existingAdmin.nidNumber === adminDto.nidNumber) {
      throw new BadRequestException('NID number already exists');
    }
    if (existingAdmin.phoneNo === adminDto.phoneNo) {
      throw new BadRequestException('Phone number already exists');
    }
  }
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(adminDto.password, saltOrRounds);

    const newAdmin = this.adminRepository.create({
      ...adminDto,
      password: hash,
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

  // Delete admin account
  async deleteAdmin(id: number): Promise<{ deleted: boolean }> {
    const result = await this.adminRepository.delete({ id });
    return { deleted: !!result.affected };
  }

  // Find admin by email or ID
  async findByEmail(email: string): Promise<Admin> {
    const admin = await this.adminRepository.findOne({
      where: { email },
      select: [
        'id',
        'email',
        'password',
        'role',
        'isTwoFactorEnabled',
        'twoFactorOtp',
        'twoFactorOtpExpiration',
        'twoFactorEmail',
      ],
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

  
  // Enable two-factor authentication for an admin
  async enableTwoFactor(
    adminId: number,
    emailForOtp: string,
  ): Promise<{ message: string }> {
    const admin = await this.findById(adminId);
    if (!admin) throw new BadRequestException('Admin not found');

    admin.twoFactorEmail = emailForOtp;

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt();
    const hashedOtp = await bcrypt.hash(otpCode, salt);
    admin.twoFactorOtp = hashedOtp;
    admin.twoFactorOtpExpiration = new Date(Date.now() + 10 * 60 * 1000);

    admin.isTwoFactorEnabled = false;

    await this.adminRepository.save(admin);

    await this.mailerService.sendMail({
      to: emailForOtp,
      subject: 'Your 2FA Setup Code',
      text: `Your two-factor authentication setup code is ${otpCode}`,
      html: `<b>Your two-factor authentication setup code is: ${otpCode}</b>`,
    });

    return { message: '2FA code sent to the provided email' };
  }

  //Send the two-factor authentication code via email
  async sendTwoFactorCodeEmail(to: string, otpCode: string): Promise<void> {
    await this.mailerService.sendMail({
      to,
      subject: 'Your 2FA Login Code',
      text: `Your two-factor authentication code is ${otpCode}`,
      html: `<b>Your two-factor authentication code is: ${otpCode}</b>`,
    });
  }

  // Verify two-factor authentication setup
  // This method checks the OTP code provided by the user
  // If valid, it enables 2FA for the admin
  async verifyTwoFactorSetup(
    adminId: number,
    code: string,
  ): Promise<{ message: string }> {
    const admin = await this.findById(adminId);
    if (!admin || !admin.twoFactorOtp || !admin.twoFactorOtpExpiration) {
      throw new BadRequestException('No pending 2FA setup verification');
    }

    if (new Date() > admin.twoFactorOtpExpiration) {
      throw new BadRequestException('OTP code expired');
    }

    if (!(await bcrypt.compare(code, admin.twoFactorOtp))) {
      throw new BadRequestException('Invalid OTP code');
    }

    admin.twoFactorOtp = undefined;
    admin.twoFactorOtpExpiration = undefined;
    admin.isTwoFactorEnabled = true;

    await this.adminRepository.save(admin);

    return { message: '2FA has been successfully enabled' };
  }
}
