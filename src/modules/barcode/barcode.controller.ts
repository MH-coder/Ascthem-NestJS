import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import { BarcodeService } from "./barcode.service";
import { barCodeDTO } from "../../common/utiles/dto/barcode.dto";
import { AuthGuard } from "../auth/guards/auth.guards";

@Controller("barcode")
export class BarcodeController {
  constructor(private barCodeService: BarcodeService) {}
  @Post("insert")
  InsertBarCode(@Body() barCodeDto: barCodeDTO) {
    return this.barCodeService.InsertBarCode(barCodeDto);
  }

  @Get("/show")
  // @UseGuards(AuthGuard)
  ReadQr() {
    return this.barCodeService.GetQrCodes();
  }

  @Get("verify")
  VerifyNew(@Query("barcode") barcode: string) {
    return this.barCodeService.VerifyQrCodes(barcode);
  }

  @Post("verify-new")
  Verify(@Body() body: any) {
    const { barcode, scan_data } = body;
    return this.barCodeService.VerifyBarcode(barcode, scan_data);
  }

  @Post("buy")
  Buy(@Body() buy: any) {
    return this.barCodeService.Buy(buy);
  }
}
