import { Test, TestingModule } from '@nestjs/testing';
import { FuelStationController } from './fuelstation.controller';

describe('FuelstationController', () => {
  let controller: FuelStationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FuelStationController],
    }).compile();

    controller = module.get<FuelStationController>(FuelStationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});