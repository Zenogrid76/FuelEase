
import { IsString, IsEmail, MaxLength, MinLength, IsOptional, Matches , IsNotEmpty } from 'class-validator';

export class CustomerDto {
  @IsString()
  @MaxLength(100)
  fullName: string;

 @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(11)
  @Matches(/^[0-9]$/, { message: 'Phone number must be exactly 11 digits' })
  phoneNo: string;
}
