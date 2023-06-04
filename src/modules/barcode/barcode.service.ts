import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { response } from "express";
import { DetailsDto } from "src/common/utiles/dto/details.dto";
import { Repository } from "typeorm";
import { barCodeDTO } from "../../common/utiles/dto/barcode.dto";
import { QrCode } from "../../common/utiles/entity/barcode.entity";
import { ProductsService } from "../products/products.service";
import { ScanDetailsService } from "../scan_details/scan_details.service";

@Injectable()
export class BarcodeService {
  private readonly logger = new Logger(BarcodeService.name);
  constructor(
    @InjectRepository(QrCode)
    private qrCodeRepository: Repository<QrCode>,
    private productService: ProductsService,
    private scanDetailsService: ScanDetailsService
  ) {}

  InsertBarCode(barCodeDto: barCodeDTO) {
    const { gtin, expDate, lot, qrNum, snLength } = barCodeDto;
    const gtinNum = this.addZeros(gtin);
    let date = expDate.replace(/-/g, "");
    for (let x = 0; x < qrNum; x++) {
      let qrString =
        "01" +
        gtinNum +
        "21" +
        this.generateRandomString(snLength).toUpperCase() +
        String.fromCharCode(29) +
        "17" +
        date.substring(2, 8) +
        "10" +
        lot.toUpperCase();
      this.insert(qrString);
    }
    throw new HttpException("Barcode Generated Successfully!", HttpStatus.OK);
  }

  GetQrCodes(): Promise<QrCode[]> {
    return this.qrCodeRepository.find();
  }

  async Buy(body: any) {
    const { qrCode, buy } = body;
    const qrData = await this.findQr(qrCode);
    if (buy == 1 || buy == true) {
      const updateStatus = await this.updateQr(qrData, {
        bought: true,
        used: true,
      });
      if (updateStatus.affected > 0) {
        throw new HttpException("Updated", HttpStatus.OK);
      }
    }
  }

  async VerifyQrCodes(barcode: string) {
    const qrData = await this.findQr(barcode);
    if (!qrData) {
      return { statusCode: 404 };
    }
    const productDetails = await this.extractBarcodeDetails(barcode);
    return { productDetails, statusCode: 200 };
  }

  async VerifyBarcode(barcode: string, detailsDto: DetailsDto) {
    const qrData = await this.findQr(barcode);
    if (!qrData) {
      detailsDto.result = "Not Valid";
      detailsDto.productScanned = barcode;
      await this.scanDetailsService.storeDetails(detailsDto);
      return { statusCode: 404 };
    }
    detailsDto.result = "Valid";
    detailsDto.productScanned = barcode;
    await this.scanDetailsService.storeDetails(detailsDto);
    const productDetails = await this.extractBarcodeDetails(barcode);
    return { productDetails, statusCode: 200 };
  }

  insert(qrString: string) {
    this.qrCodeRepository.save({ barCode: qrString });
  }

  updateQr(qrData: any, newData: any) {
    return this.qrCodeRepository.update(qrData, newData);
  }

  async findQr(barCode: string) {
    return this.qrCodeRepository.findOne({ where: { barCode: barCode } });
  }

  async findBarcode(barCode: string) {
    return this.qrCodeRepository.findOne({ where: { barCode: barCode } });
  }

  async extractBarcodeDetails(barCode: string) {
    const productDetails = {
      NDC_number: 65432,
      drug_name: "Tylenol",
      dosage_strength: "500 mg",
      dosage_form: "Caplet",
      packaging: "Bottle",
      lot_number: 53674683,
      exp_date: new Date("2024-10-15"),
      manufacturer_name: "Johnson & Johnson",
      manufacturer_address: "New Brunswick, NJ",
      manufacturing_site: "Unknown",
      special_promotions: null,
    };

    // await this.productService.insertProductDetails(productDetails);
    return productDetails;
  }

  generateRandomString(length: number) {
    let result = "";
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }

  addZeros(gtin: string) {
    let newGTIN = gtin.toUpperCase();
    if (
      newGTIN.length == 8 ||
      newGTIN.length == 12 ||
      newGTIN.length == 13 ||
      newGTIN.length == 14
    ) {
      gtin = newGTIN.padStart(14, "0");
      return gtin;
    }
  }
}
