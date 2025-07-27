import { IsEmail, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class CustomerDto {
  @IsString()
  @Matches(/^[a-zA-Z\s]+$/, { message: 'Name must not contain special characters.' })
  name: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  @Matches(/[a-z]/, { message: 'Password must contain at least one lowercase letter.' })
  password: string;

  @IsOptional()

  pdfFile?: string;

  @IsEmail()
  email: string;

  @Matches(/^01[0-9]{8,9}$/, { message: 'Phone number must start with 01 and be 11 digits.' })
  phoneNo: string;
}
