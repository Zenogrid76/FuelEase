// fuel-station.dto.ts
import
{ IsString,
IsInt,
IsNumber,
IsEnum, } from 'class-validator';
 
export class CreateFuelStationDto {
  @IsString()
  fuelType: string;
 
  @IsInt()
  quantity: number;
 
  @IsNumber()
  price: number;
 
  @IsEnum(['available', 'unavailable'])
  status: 'available' | 'unavailable';
 
}
