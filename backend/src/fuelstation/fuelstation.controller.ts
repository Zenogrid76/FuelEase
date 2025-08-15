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
    // Placeholder
    return this.fuelStationService.addStation(req.user.sub, dto);
  }

  @Put('update/:id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateStation(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFuelStationDto) {
    // Placeholder
    return this.fuelStationService.updateStation(id, dto);
  }

  @Delete('remove/:id')
  async removeStation(@Param('id', ParseIntPipe) id: number) {
    // Placeholder
    return this.fuelStationService.removeStation(id);
  }

  @Get('all')
  async viewAllStations(@Request() req) {
    // Placeholder
    return this.fuelStationService.viewAllStations(req.user.sub);
  }

  
}
