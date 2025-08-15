import { IsString, IsOptional } from 'class-validator';

export class CreateFuelStationDto {
  @IsString()
  name: string;

  @IsString()
  location: string;

  @IsOptional()
  @IsString()
  notes?: string;
}