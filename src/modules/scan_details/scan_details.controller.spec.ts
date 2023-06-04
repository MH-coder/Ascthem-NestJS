import { Test, TestingModule } from '@nestjs/testing';
import { ScanDetailsController } from './scan_details.controller';

describe('ScanDetailsController', () => {
  let controller: ScanDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScanDetailsController],
    }).compile();

    controller = module.get<ScanDetailsController>(ScanDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
