import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { DetailsDto } from "src/common/utiles/dto/details.dto";
import { ScanDetailsService } from "./scan_details.service";

@Controller("scan-details")
export class ScanDetailsController {
  constructor(private scanDetailsService: ScanDetailsService) {}

  @Get("fetchData")
  getUser(@Query("sort") sort: string, @Query("column") column: string) {
    return this.scanDetailsService.getScanData(sort, column);
  }

  @Post("store")
  store(@Body() body: any) {
    return this.scanDetailsService.storeDetails(body);
  }
}
