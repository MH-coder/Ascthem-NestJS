import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Products } from "src/common/utiles/entity/products.entity";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";
import { ScanDetailsModule } from "../scan_details/scan_details.module";
import { UserModule } from "../user/user.module";

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([Products]),
    ScanDetailsModule,
    UserModule,
  ],
})
export class ProductsModule {}
