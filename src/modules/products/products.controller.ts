import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { ProductsService } from "./products.service";

@Controller("product")
export class ProductsController {
  constructor(private productService: ProductsService) {}

  @Get("getproduct")
  getProductDetails(
    @Query("barcode") barcode: string,
    @Query("userId") userId: number
  ) {
    return this.productService.extractBarcodeDetails(barcode, userId);
  }

  @Post("verify")
  Verify(@Body() body: any) {
    const { barcode, scan_data } = body;
    return this.productService.VerifyProduct(barcode, scan_data);
  }
}
