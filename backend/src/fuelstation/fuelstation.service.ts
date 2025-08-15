import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FuelStation } from './fuelstation.entity';
import { Repository } from 'typeorm';
import { CreateFuelStationDto } from './dtos/createfuelstation.dto';
import { UpdateFuelStationDto } from './dtos/updatefuelstation.dto'; 

@Injectable()
export class FuelStationService {
  constructor(
    @InjectRepository(FuelStation)
    private readonly fuelStationRepo: Repository<FuelStation>
  ) {}

  // Add fuel station
  async addStation(adminId: number, createdto: CreateFuelStationDto): Promise<FuelStation> {
    const newStation = this.fuelStationRepo.create({
      ...createdto,
      adminId,
    });
    return this.fuelStationRepo.save(newStation);
  }

  // Update station info
  async updateStation(stationId: number, updatedto: UpdateFuelStationDto): Promise<FuelStation> {
    const station = await this.fuelStationRepo.findOneBy({ id: stationId });
    if (!station) throw new NotFoundException('Station not found');
    Object.assign(station, updatedto);
    return this.fuelStationRepo.save(station);
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

  /*
  // View all stations, along with admin info (who manages each station)
  async viewAllStations(): Promise<FuelStation[]> {
    return this.fuelStationRepo.find({ relations: ['admin'] }); // Make sure 'admin' relation is set up in your entity
  }*/

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
