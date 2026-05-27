import { Test, TestingModule } from '@nestjs/testing';
import { LossesController } from './losses.controller';
import { LossesService } from './losses.service';

describe('LossesController', () => {
  let controller: LossesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LossesController],
      providers: [LossesService],
    }).compile();

    controller = module.get<LossesController>(LossesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
