import {
  IsString,
  MinLength,
  IsOptional,
  IsEmail,
  Matches,
  IsNotEmpty,
} from 'class-validator';

export class AdminDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Za-z\s]+$/, { message: 'Name must contain only alphabets and spaces' })
  fullName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  profileImage?: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format' })
  @Matches(/@.*\.xyz$/, { message: 'Email must contain "@" and end with .xyz' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9]{10}$/, { message: 'NID must be exactly 10 digits' })
  nidNumber: string;


  @IsOptional()
  nidImage?: any;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9]{11}$/, { message: 'Phone number must be exactly 11 digits' })
  phoneNo: string;
  
  @IsOptional()
  age?: number;
}
