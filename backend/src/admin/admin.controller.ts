import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateAdminDto } from './dtos/admin.dto';
import { AdminService } from './admin.service';
import { MulterError } from 'multer';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('create')
  @UseInterceptors(
    FileInterceptor('nidImage', {
      storage: diskStorage({
        destination: './uploads/nid-images',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExtName = extname(file.originalname);
          cb(null, `${uniqueSuffix}${fileExtName}`);
        },
      }),
      limits: {
        fileSize: 2 * 1024 * 1024, 
      },
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpg', 'image/png','image/jpeg', 'image/gif'];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'Only JPG or PNG images allowed'), false);
        }
      },
    }),
  )
async create(
    @Body('data') data: string,
    @UploadedFile() nidImage?: Express.Multer.File,
  ) {
    if (!data) {
      throw new BadRequestException('No data provided');
    }
    const createAdminDto = plainToInstance(CreateAdminDto, JSON.parse(data));
    const errors = await validate(createAdminDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    if (nidImage) {
      createAdminDto.nidImage = nidImage.path;
    }
    // Save to database and return DB entity
    return this.adminService.createAdmin(createAdminDto);
  }
}
