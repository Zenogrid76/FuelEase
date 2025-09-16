import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FuelStation } from './fuelstation.entity';
import { FuelStationService } from './fuelstation.service';
import { FuelStationController } from './fuelstation.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FuelStation])],
  providers: [FuelStationService],
  controllers: [FuelStationController],
  exports: [FuelStationService]
})
export class FuelStationModule {}