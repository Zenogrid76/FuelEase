// create-operator.dto.ts
import {
  IsString,
  Matches,
  IsNotEmpty,
  MaxLength,
  IsEmail,
  IsDateString,
  IsEnum,
  IsOptional,
  Length,
  IsNumber
} from 'class-validator';

export class CreateOperatorDto {
  @IsString({ message: 'Name must be a string' })
  @Matches(/^[A-Za-z\s]+$/, { message: 'Name should only contain letters' })
  name: string;
  
  @IsEmail({}, { message: 'Invalid email format' })
  @Matches(/^[A-Za-z0-9._%+-]+@gmail\.com$/, { message: 'Email must end with @gmail.com' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @Length(8, 8, { message: 'Password must be exactly 8 characters long' })
  @Matches(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  @Matches(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' })
  password: string;

 @IsNotEmpty()
  @Length(11, 11, { message: 'Phone number must be exactly 11 digits' })
  phoneNo: string;

  @IsNumber()
  @IsNotEmpty()
  age: number; 

 @IsDateString({}, { message: 'Joining date must be a valid date' })
  joiningDate: string;

  @IsEnum(['male', 'female'], { message: 'Gender must be either male or female' })
  gender: 'male' | 'female';

  @IsString({ message: 'Address must be a string' })
  @MaxLength(100, { message: 'Address can be at most 100 characters long' })
  address?: string;

  @IsOptional()
  @IsString({ message: 'Profile image must be a string (file path or URL)' })
  profileImage?: string;

  @IsEnum(['active', 'inactive', 'on_leave'], {
    message: 'Status must be active, inactive, or on_leave',
  })
  status: 'active' | 'inactive' | 'on_leave';
}
