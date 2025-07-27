import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AdminService } from './admin.service';
import { AdminDto } from './dtos/admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  //localhost:3000/admin/create
  @Post('create')
  async createAdmin(@Body() createAdminDto: AdminDto) {
    return this.adminService.createAdmin(createAdminDto);
  }

  //  Upload/update profile image
  //localhost:3000/admin/profile-image/:id
  @Put('profile-image/:id')
  @UseInterceptors(FileInterceptor('profileImage', {
    storage: diskStorage({
      destination: './uploads/profile-images',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname));
      },
    }),
    fileFilter: (req, file, cb) => {
      const allowed = ['image/jpg', 'image/png', 'image/jpeg', 'image/webp'];
      if (allowed.includes(file.mimetype)) cb(null, true);
      else cb(new BadRequestException('Only image files are allowed'), false);
    },
  }))
  async uploadProfileImage(
    @Param('id') id: number,
    @UploadedFile() profileImage: Express.Multer.File,
  ) {
    if (!profileImage) {
      throw new BadRequestException('Profile image file must be provided');
    }
    return this.adminService.updateProfileImage(id, profileImage.path);
  }


  // 3. Upload/update NID image
  //localhost:3000/admin/nid-image/:id
  @Put('nid-image/:id')
  @UseInterceptors(FileInterceptor('nidImage', {
    storage: diskStorage({
      destination: './uploads/nid-images',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname));
      },
    }),
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
    fileFilter: (req, file, cb) => {
      const allowed = ['image/jpg', 'image/png', 'image/jpeg', 'image/webp'];
      if (allowed.includes(file.mimetype)) cb(null, true);
      else cb(new BadRequestException('Only image files are allowed'), false);
    },
  }))
  async uploadNidImage(
    @Param('id') id: number,
    @UploadedFile() nidImage: Express.Multer.File,
  ) {
    if (!nidImage) {
      throw new BadRequestException('NID image file must be provided');
    }
    return this.adminService.updateNidImage(id, nidImage.path);
  }



  // 4. Delete admin by ID
  //localhost:3000/admin/:id
  @Delete('delete/:id')
  async deleteAdmin(@Param('id') id: number) {
    return this.adminService.deleteAdmin(id);
  }

  // 5. Find admin by email
  //localhost:3000/admin/login
  @Post('login')
  async login(@Body() body: { email: string; pass: string }) {
    const { email, pass} = body;
    const admin = await this.adminService.findByEmail(email);
    if (!admin) {
      throw new BadRequestException('Invalid email');
    }
    if (admin.password !== pass) {
      throw new BadRequestException('Invalid password');
    }
    return admin;
  }

  // 6. Get admin profile image by ID
  //localhost:3000/admin/profile-image/:id
  @Get('profile-image/:id')
  async getProfileImage(@Param('id') id: number) {
    const admin = await this.adminService.findById(id);
    if (!admin) throw new BadRequestException('Admin not found');
    return { profileImage: admin.profileImage };
  }

}