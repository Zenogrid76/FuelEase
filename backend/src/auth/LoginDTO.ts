import {
  IsEmail,
  IsNotEmpty,
  Length, 
  Matches } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Invalid email format' })
   @Matches(/^[A-Za-z0-9._%+-]+@gmail\.com$/, { message: 'Email must end with @gmail.com' })
   email: string;
 
   @IsNotEmpty({ message: 'Password is required' })
   @Length(8, 8, { message: 'Password must be exactly 8 characters long' })
   @Matches(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
   @Matches(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' })
   password: string;
}
