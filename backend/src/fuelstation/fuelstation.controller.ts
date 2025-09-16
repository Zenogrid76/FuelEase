// fuel-station.controller.ts
import { Controller, Get, Post, Patch, Delete, Param, Body, ParseIntPipe, Put, UseGuards, BadRequestException, ValidationPipe, UsePipes , Request } from '@nestjs/common';
import { FuelStation } from './fuelstation.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { FuelStationService } from './fuelstation.service';
import { CreateFuelStationDto } from './createfuelstation.dto';
import { UpdateFuelStationDto } from './updatefuelstation.dto';


@Controller('fuel-stations')
export class FuelStationController {
  constructor(private readonly fuelStationService: FuelStationService) {}

  @Post('create')
  @UseGuards(AuthGuard)
  //@UsePipes(new ValidationPipe({ whitelist: true }))
  async createFuelStation(
    @Request() req,
    @Body() dto: CreateFuelStationDto,
  ): Promise<FuelStation> {
    return this.fuelStationService.createFuelStation(req.user.sub, dto);
  }

  // Get all fuel stations with operator info
  @Get()
  @UseGuards(AuthGuard)
  async getAllFuelStations(): Promise<FuelStation[]> {
    return await this.fuelStationService.getAllFuelStations();
  }
  
  @Put(':id')
@UseGuards(AuthGuard)
async replaceFuelStation(
  @Param('id', ParseIntPipe) id: number,
  @Body() updateData: UpdateFuelStationDto,
): Promise<FuelStation> {
  return await this.fuelStationService.updateFuelStation(id, updateData);
}

  // Delete fuel station by ID
  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteFuelStation(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.fuelStationService.deletefuelstation(id);
    return { message: `Fuel station with ID ${id} deleted successfully` };
  }
}
