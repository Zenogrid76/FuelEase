// fuel-station.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FuelStation } from './fuelstation.entity';
import { CreateFuelStationDto } from './createfuelstation.dto';

@Injectable()
export class FuelStationService {
  findById(id: number) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(FuelStation)
    private readonly fuelStationRepository: Repository<FuelStation>,
  ) {}

// Add new fuel station (fuel type, quantity, price) 
async createFuelStation(operatorId: number, dto: CreateFuelStationDto): Promise<FuelStation> {
  const newStation = this.fuelStationRepository.create({
    ...dto,
    operator: { id: operatorId },
  });
  return this.fuelStationRepository.save(newStation);
} 

  // Update price & quantity by fuel id
  async updateFuelStation(id: number,updateData: Partial<FuelStation>,): Promise<FuelStation> {
    const fuelStation = await this.fuelStationRepository.findOne({ where: { id } });

    if (!fuelStation) {
      throw new NotFoundException(`Fuel station with ID ${id} not found`);
    }

    Object.assign(fuelStation, updateData);
    return await this.fuelStationRepository.save(fuelStation);
  }

  //  Get all fuel stations with operator info
  async getAllFuelStations(): Promise<FuelStation[]> {
    return await this.fuelStationRepository.find({
      relations: ['operator'],
    });
  }

// Delete the fuel station
async deletefuelstation(id: number): Promise<{ message: string }> {
  // First, check if the fuel station exists
  const fuelStation = await this.fuelStationRepository.findOne({ where: { id } });

  if (!fuelStation) {
    return { message: `Fuel station with ID ${id} not found` };
  }

  await this.fuelStationRepository.delete(id);
  return { message: `Fuel station with ID ${id} deleted successfully` };
}


}
