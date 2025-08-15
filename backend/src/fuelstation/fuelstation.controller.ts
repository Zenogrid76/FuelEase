import { Controller, Post, Body, Put, Param, Delete, Get, UseGuards, Request, UsePipes, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { FuelStationService } from './fuelstation.service';
import { CreateFuelStationDto } from './dtos/createfuelstation.dto';
import { UpdateFuelStationDto } from './dtos/updatefuelstation.dto'; 
import { AuthGuard } from '../auth/auth.guard';

@Controller('fuelstation')
@UseGuards(AuthGuard)
export class FuelStationController {
  constructor(private readonly fuelStationService: FuelStationService) {}

  @Post('add')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async addStation(@Request() req, @Body() dto: CreateFuelStationDto) {
    return this.fuelStationService.addStation(req.user.sub, dto);
  }

  @Put('update/:id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateStation(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFuelStationDto) {
    return this.fuelStationService.updateStation(id, dto);
  }

  @Delete('remove/:id')
  async removeStation(@Param('id', ParseIntPipe) id: number) {
    return this.fuelStationService.removeStation(id);
  }

  @Get('all')
  async viewAllStations(@Request() req) {
    return this.fuelStationService.viewAllStations();
  }

  @Get('managed')
  async viewAllManagedStations(@Request() req) {

    return this.fuelStationService.viewAllManagedStations(req.user.sub);
  }
}
