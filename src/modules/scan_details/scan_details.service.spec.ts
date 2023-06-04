import { Test, TestingModule } from '@nestjs/testing';
import { ScanDetailsService } from './scan_details.service';

describe('ScanDetailsService', () => {
  let service: ScanDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScanDetailsService],
    }).compile();

    service = module.get<ScanDetailsService>(ScanDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
