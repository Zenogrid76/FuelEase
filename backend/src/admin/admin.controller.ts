import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  Patch,
  UseGuards,
  UnauthorizedException,
  Request,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AdminService } from './admin.service';
import { AdminDto } from './dtos/admin.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Create a new admin (only if logged in)
  //localhost:3000/admin/create
  //@UseGuards(AuthGuard)
  @Post('create')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createAdmin(@Body() createAdminDto: AdminDto) {
    return this.adminService.createAdmin(createAdminDto);
  }

  // Upload/update profile image (own account only)
  //localhost:3000/admin/profile-image
  @UseGuards(AuthGuard)
  @Put('profile-image')
  @UseInterceptors(
    FileInterceptor('profileImage', {
      storage: diskStorage({
        destination: './uploads/profile-images',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowed = ['image/jpg', 'image/png', 'image/jpeg', 'image/webp'];
        if (allowed.includes(file.mimetype)) cb(null, true);
        else cb(new BadRequestException('Only image files are allowed'), false);
      },
    }),
  )
  async uploadProfileImage(
    @UploadedFile() profileImage: Express.Multer.File,
    @Request() req: any,
  ) {
    if (!profileImage) {
      throw new BadRequestException('Profile image file must be provided');
    }

    const adminId = Number(req.user.sub);
    return this.adminService.updateProfileImage(adminId, profileImage.path);
  }

  // Upload/update NID image (own account only)
  //localhost:3000/admin/nid-image
  @UseGuards(AuthGuard)
  @Put('nid-image')
  @UseInterceptors(
    FileInterceptor('nidImage', {
      storage: diskStorage({
        destination: './uploads/nid-images',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      limits: { fileSize: 2 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        const allowed = ['image/jpg', 'image/png', 'image/jpeg', 'image/webp'];
        if (allowed.includes(file.mimetype)) cb(null, true);
        else cb(new BadRequestException('Only image files are allowed'), false);
      },
    }),
  )
  async uploadNidImage(
    @UploadedFile() nidImage: Express.Multer.File,
    @Request() req: any,
  ) {
    if (!nidImage) {
      throw new BadRequestException('NID image file must be provided');
    }

    const adminId = Number(req.user.sub);
    return this.adminService.updateNidImage(adminId, nidImage.path);
  }

  // Delete admin (only your own account)
  //localhost:3000/admin/delete
  @UseGuards(AuthGuard)
  @Delete('delete')
  async deleteAdmin(@Request() req: any) {
    const adminId = Number(req.user.sub);
    return this.adminService.deleteAdmin(adminId);
  }

  // Get admin profile image (requires login)
  //localhost:3000/admin/profile-image/:id
  @UseGuards(AuthGuard)
  @Get('profile-image/:id')
  async getProfileImage(@Param('id', ParseIntPipe) id: number) {
    const admin = await this.adminService.findById(id);
    if (!admin) throw new BadRequestException('Admin not found');
    return { profileImage: admin.profileImage };
  }

  // Change the status of a user (requires login
  //localhost:3000/admin/status/:id)
  @UseGuards(AuthGuard)
  @Patch('status/:id')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: 'active' | 'inactive',
  ) {
    if (status !== 'active' && status !== 'inactive') {
      throw new BadRequestException(
        'Status must be either "active" or "inactive"',
      );
    }
    return this.adminService.updateStatus(id, status);
  }

  // Get all inactive admins (requires login)
  //localhost:3000/admin/inactive
  @UseGuards(AuthGuard)
  @Get('inactive')
  async getInactiveAdmins() {
    return this.adminService.findInactiveUsers();
  }

  // Get admins older than (requires login)
  //localhost:3000/admin/older-than/:age
  @UseGuards(AuthGuard)
  @Get('older-than/:age')
  async getAdminsOlderThan(@Param('age') age: string) {
    const ageNum = parseInt(age, 10);

    if (isNaN(ageNum) || ageNum < 0) {
      throw new BadRequestException('Age must be a positive number');
    }

    return this.adminService.findUsersOlderThan(ageNum);
  }

    @UseGuards(AuthGuard)
  @Post('enable-2fa')
  async enableTwoFactor(
    @Request() req: any,
    @Body('emailForOtp') emailForOtp: string,
  ) {
    if (!emailForOtp) {
      throw new BadRequestException('Email for OTP is required');
    }

    const adminId = req.user.sub; // from JWT
    return this.adminService.enableTwoFactor(adminId, emailForOtp);
  }

}
