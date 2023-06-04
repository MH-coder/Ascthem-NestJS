import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BarcodeController } from "./barcode.controller";
import { BarcodeService } from "./barcode.service";
import { QrCode } from "../../common/utiles/entity/barcode.entity";
import { UserService } from "../user/user.service";
import { UserModule } from "../user/user.module";
import { ProductsModule } from "../products/products.module";
import { ScanDetailsModule } from "../scan_details/scan_details.module";

@Module({
  controllers: [BarcodeController],
  providers: [BarcodeService],
  imports: [
    TypeOrmModule.forFeature([QrCode]),
    UserModule,
    ProductsModule,
    ScanDetailsModule,
  ],
})
export class BarcodeModule {}
