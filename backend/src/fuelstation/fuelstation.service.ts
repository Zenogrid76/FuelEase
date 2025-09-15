import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FuelStation } from './fuelstation.entity';
import { Repository } from 'typeorm';
import { CreateFuelStationDto } from './dtos/createfuelstation.dto';
import { UpdateFuelStationDto } from './dtos/updatefuelstation.dto'; 
import Pusher from 'pusher';

@Injectable()
export class FuelStationService {
  constructor(
    @InjectRepository(FuelStation)
    private readonly fuelStationRepo: Repository<FuelStation>,
    @Inject('PUSHER') private readonly pusher: Pusher
  ) {}

  // Add fuel station
// Add fuel station

  async addStation(adminId: number, createdto: CreateFuelStationDto): Promise<FuelStation> {
    // Create and save new station
    const newStation = this.fuelStationRepo.create({
      ...createdto,
      adminId,
    });
    const savedStation = await this.fuelStationRepo.save(newStation);

    // Re-fetch with admin relation
    const fullStation = await this.fuelStationRepo.findOne({
      where: { id: savedStation.id },
      relations: ['admin'],
    });

    if (!fullStation) throw new NotFoundException('Station not found after creation');

    // Trigger Pusher notification
    await this.pusher.trigger('admin-channel', 'new-station', {
      message: `A new station "${fullStation.name}" was added by ${fullStation.admin.fullName}.`,
      stationId: fullStation.id,
      adminId: fullStation.admin.id,
    });

    return fullStation;
  }

 async updateStation(stationId: number, updatedto: UpdateFuelStationDto): Promise<FuelStation> {
  const station = await this.fuelStationRepo.findOne({
    where: { id: stationId },
  });
  if (!station) throw new NotFoundException('Station not found');

  Object.assign(station, updatedto);
  await this.fuelStationRepo.save(station);

  // Re-fetch with admin relation included
  const updatedStation = await this.fuelStationRepo.findOne({
    where: { id: stationId },
    relations: ['admin'],
  });

  if (!updatedStation) throw new NotFoundException('Station not found after update');

  // Trigger Pusher notification about the update
  await this.pusher.trigger('admin-channel', 'update-station', {
    message: `Station "${updatedStation.name}" was updated by ${updatedStation.admin.fullName}.`,
    stationId: updatedStation.id,
    adminId: updatedStation.admin.id,
  });

  return updatedStation;
}


  // Remove station
  async removeStation(stationId: number): Promise<{ deleted: boolean }> {
    const result = await this.fuelStationRepo.delete(stationId);
    return { deleted: !!result.affected };
  }

  // View all stations managed by a specific admin
  async viewAllManagedStations(adminId: number): Promise<FuelStation[]> {
    return this.fuelStationRepo.find({ where: { adminId } });
  }

  async viewAllStations(): Promise<any[]> {
  const stations = await this.fuelStationRepo.find({ relations: ['admin'] });

  return stations.map(station => ({
    id: station.id,
    name: station.name,
    location: station.location,
    notes: station.notes,
    createdAt: station.createdAt,
    admin: {
      id: station.admin.id,
      fullName: station.admin.fullName,
      email: station.admin.email,
    },
  }));
}

}
