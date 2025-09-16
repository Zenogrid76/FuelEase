import {
  Controller,
  Post,
  Put,
  Patch,
  Get,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OperatorService } from './operator.service';
import { CreateOperatorDto } from './createoperator.dto';
import { Operator } from './operator.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { extname } from 'path';
import { diskStorage } from 'multer';

@Controller('operator')
export class OperatorController {
  constructor(private readonly operatorService: OperatorService) {}

  @Post('create')
//  @UsePipes(new ValidationPipe({ whitelist: true }))
  createOperator(@Body() createOperatorDto: CreateOperatorDto) {
    console.log(createOperatorDto);
    return this.operatorService.createOperator(createOperatorDto);
  }

@Put('update/:id')
  @UseGuards(AuthGuard)
  updateOperatorData(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Operator>,
 ) {
    return this.operatorService.updateOperatorData(id, data);
  }

  @Patch('status/:id')
  @UseGuards(AuthGuard)
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: 'active' | 'inactive' | 'on_leave',
  ) {
    return this.operatorService.updateStatus(id, status);
  }

  @Patch('profile-image/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file', { storage: diskStorage({
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
    })
)
  async updateProfileImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('File not provided');
    const filePath = file.path;
    return this.operatorService.updateProfileImage(id, filePath);
  }
  
@Get('email/:email')
@UseGuards(AuthGuard)
async findByEmail(@Param('email') email: string) {
  return this.operatorService.findByEmail(email);
}

  
  @Get('inactive')
  @UseGuards(AuthGuard)
  findInactiveOperators() {
    return this.operatorService.findInactiveOperators();
  }

  @Get('older-than/:age')
  @UseGuards(AuthGuard)
  findOperatorsOlderThan(@Param('age', ParseIntPipe) age: number) {
    return this.operatorService.findOperatorsOlderThan(age);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.operatorService.findById(id);
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard)
  deleteOperator(@Param('id', ParseIntPipe) id: number) {
    return this.operatorService.deleteOperator(id);
  }
  // operator.controller.ts
@Get('email/:email')
@UseGuards(AuthGuard)
async findByEmailname(@Param('email') email: string) {
  return this.operatorService.findByEmail(email);
}

@Get()
@UseGuards(AuthGuard)
async findAllOperators() {
  return this.operatorService.findAllOperators();
}


@Get('profile')
@UseGuards(AuthGuard)
getProfile(@Req() req: any) {
  const operatorId = Number(req.user?.sub);

  if (!req.user?.sub || isNaN(operatorId)) {
    throw new BadRequestException('Invalid operator ID from JWT');
  }

  return this.operatorService.findById(operatorId);
}


}
