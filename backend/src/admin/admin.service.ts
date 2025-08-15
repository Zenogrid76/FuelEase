import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Admin} from './admin.entity';
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

  async createAdmin(
    adminDto: AdminDto,
    creatorFullName: string,
  ): Promise<Admin> {
    const salt = await bcrypt.genSalt();


    // Hash the provided password from adminDto
    const hash = await bcrypt.hash(adminDto.password, salt);

    const newAdmin = this.adminRepository.create({
      ...adminDto,
      password: hash,
    });

    const savedAdmin = await this.adminRepository.save(newAdmin);

    // Send welcome email (without reset/2FA link)
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

  /*

  async createAdmin(adminDto: AdminDto) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(adminDto.password, saltOrRounds);

    const newAdmin = this.adminRepository.create({
      ...adminDto,
      password: hash,
    });

    return this.adminRepository.save(newAdmin);
  }*/

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

    // Save the OTP email in the database
    admin.twoFactorEmail = emailForOtp;

    // Generate 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

     // Hash the OTP before storing
    const salt = await bcrypt.genSalt();

    const hashedOtp = await bcrypt.hash(otpCode, salt);

    admin.twoFactorOtp = hashedOtp;

    admin.twoFactorOtpExpiration = new Date(Date.now() + 10 * 60 * 1000);

    // Mark 2FA as pending activation (you could keep false until verified)
    admin.isTwoFactorEnabled = false; // safer to set true only after verifyTwoFactorSetup()

    await this.adminRepository.save(admin);

    // Send OTP setup code to the provided email
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

    // Clear OTP fields, confirm 2FA enabled
    admin.twoFactorOtp = undefined;
    admin.twoFactorOtpExpiration = undefined;
    admin.isTwoFactorEnabled = true;

    await this.adminRepository.save(admin);

    return { message: '2FA has been successfully enabled' };
  }
}
