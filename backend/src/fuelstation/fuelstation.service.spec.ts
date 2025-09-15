import { Test, TestingModule } from '@nestjs/testing';
import { FuelStationService } from './fuelstation.service';

describe('FuelstationService', () => {
  let service: FuelStationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FuelStationService],
    }).compile();

    service = module.get<FuelStationService>(FuelStationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
