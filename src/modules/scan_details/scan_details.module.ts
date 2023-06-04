import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ScanningDetails } from "src/common/utiles/entity/scandetails.entity";
import { ScanDetailsController } from "./scan_details.controller";
import { ScanDetailsService } from "./scan_details.service";

@Module({
  controllers: [ScanDetailsController],
  providers: [ScanDetailsService],
  imports: [TypeOrmModule.forFeature([ScanningDetails])],
  exports: [ScanDetailsService],
})
export class ScanDetailsModule {}
