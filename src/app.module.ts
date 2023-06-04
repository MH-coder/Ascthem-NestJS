import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { databaseConfig } from "./config/database.config";
import { UserModule } from "./modules/user/user.module";
import { AuthModule } from "./modules/auth/auth.module";
import { BarcodeModule } from "./modules/barcode/barcode.module";
import { loggerConfig } from "./config/logger.config";
import { ScanDetailsModule } from "./modules/scan_details/scan_details.module";
import { ProductsModule } from "./modules/products/products.module";

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot(databaseConfig),
    loggerConfig,
    AuthModule,
    BarcodeModule,
    ScanDetailsModule,
    ProductsModule,
  ],
})
export class AppModule {}
