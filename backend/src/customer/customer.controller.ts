import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  UseInterceptors,
  UploadedFile,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CustomerService } from './customer.service';
import { CustomerDto } from './dtos/customer.dto';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  // POST /customers - Create a new customer (without PDF)
  @Post()
  async createCustomer(@Body() dto: CustomerDto) {
    return this.customerService.createCustomer(dto);
  }

  // PUT /customers/pdf/:id - Upload/Update customer PDF file
  @Put('pdf/:id')
  @UseInterceptors(
    FileInterceptor('pdfFile', {
      storage: diskStorage({
        destination: './uploads/customer-pdfs',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
          cb(null, true);
        } else {
          cb(new BadRequestException('Only PDF files are allowed'), false);
        }
      },
    }),
  )
  async uploadPdfFile(
    @Param('id') id: number,
    @UploadedFile() pdfFile: Express.Multer.File,
  ) {
    if (!pdfFile) {
      throw new BadRequestException('PDF file must be provided');
    }
    return this.customerService.updatePdfFile(id, pdfFile.path);
  }

  // DELETE /customers/:id - Delete customer by ID
  @Delete(':id')
  async deleteCustomer(@Param('id') id: number) {
    return this.customerService.deleteCustomer(id);
  }
}
