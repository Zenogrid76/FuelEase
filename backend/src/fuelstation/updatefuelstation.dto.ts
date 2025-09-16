// update-fuel-station.dto.ts
import { IsString, IsInt, IsNumber, IsEnum, IsOptional } from 'class-validator';

export class UpdateFuelStationDto {
  @IsOptional()
  @IsString()
  fuelType?: string;

  @IsOptional()
  @IsInt()
  quantity?: number;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsEnum(['available', 'unavailable'])
  status?: 'available' | 'unavailable';

  @IsOptional()
  @IsInt()
  operator_id?: number;
}
