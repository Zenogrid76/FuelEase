import {
    IsString,
    MinLength,
    IsOptional,
    IsEmail,
    Matches,
    IsNotEmpty,
    IsNumberString,
    IsMimeType,
} from 'class-validator';

export class CreateAdminDto {

    @IsNotEmpty()
    @IsString()
    @Matches(/^[A-Za-z\s]+$/, { message: 'Name must contain only alphabets and spaces' })
    name: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;

    @IsOptional()
    @IsString()
    profileImage?: string;

    @IsNotEmpty()
    @IsEmail({}, { message: 'Invalid email format' })
    @Matches(/^[^@]+@[^@]+\.xyz$/, { message: 'Email must be a valid address ending with .xyz' })
    email: string;

    @IsNotEmpty()
    @IsNumberString()
    @Matches(/^[0-9]{10}$/, { message: 'NID must be exactly 10 digits' })
    nidNumber: string;

   
    @IsOptional()
    @IsMimeType({ message: 'NID image must be a valid image file' })
    nidImage?: any;

    @IsNumberString()
    @Matches(/^[0-9]{11}$/, { message: 'Phone number must be exactly 11 digits' })
    phoneNo: string;
}
