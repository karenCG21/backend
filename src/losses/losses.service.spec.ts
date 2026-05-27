import { Test, TestingModule } from '@nestjs/testing';
import { LossesService } from './losses.service';

describe('LossesService', () => {
  let service: LossesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LossesService],
    }).compile();

    service = module.get<LossesService>(LossesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
