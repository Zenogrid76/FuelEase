import { IsString, MaxLength, IsBoolean, IsOptional } from 'class-validator';

export class CustomerDto {
  @IsString()
  @MaxLength(100)
  username: string;

  @IsString()
  @MaxLength(150)
  fullName: string;

  @IsOptional()
  @IsBoolean()
  isActve?: boolean;
}
