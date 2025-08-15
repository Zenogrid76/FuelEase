import { Test, TestingModule } from '@nestjs/testing';
import { FuelstationController } from './fuelstation.controller';

describe('FuelstationController', () => {
  let controller: FuelstationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FuelstationController],
    }).compile();

    controller = module.get<FuelstationController>(FuelstationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
