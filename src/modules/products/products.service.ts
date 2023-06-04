import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DetailsDto } from "src/common/utiles/dto/details.dto";
import { ProductDto } from "src/common/utiles/dto/product.dto";
import { Products } from "src/common/utiles/entity/products.entity";
import { Like, Repository } from "typeorm";
import { ScanDetailsService } from "../scan_details/scan_details.service";
import { UserService } from "../user/user.service";
import { parseBarcode } from "gs1-barcode-parser-mod";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
    private scanDetailsService: ScanDetailsService,
    private userService: UserService
  ) {}
  async extractBarcodeDetails(barCode: string, userId: number) {
    const product = await this.findProductByItemNumber(barCode);
    const user = await this.userService.findByUserId(userId);
    return { product, user };
  }
  async VerifyProduct(itemNumber: string, detailsDto: DetailsDto) {
    let code = itemNumber;
    if (isNaN(Number(itemNumber.charAt(0)))) {
      code = itemNumber.slice(1);
    }
    try {
      const decoded = await parseBarcode(code);
      const [item1, item2] = decoded.parsedCodeItems;
      const barcode = `${item1.ai}${item1.data}${item2.ai}${item2.data}`;

      // const product = await this.findProductByItemNumber(barcode);

      const product = await this.findProductBySerialNumber(item2.data);

      if (!product || product.scan_count > 4) {
        if (!product) {
          detailsDto.result = "Not Genuine";
        } else {
          detailsDto.result = "Too Many Scans";
        }
        detailsDto.productScanned = barcode;
        await this.scanDetailsService.storeDetails(detailsDto);
        if (product) {
          await this.productsRepository.save(product);
        }
        return {
          product: product || [],
          barcode_details: decoded || [],
          statusCode: !product ? 404 : 429,
        };
      }
      const checkGTIN = await this.verifyGTIN(product.itemNumber, item1.data);

      if (checkGTIN) {
        detailsDto.result = "Genuine";
        detailsDto.productScanned = barcode;
        product.scan_count++;
        await this.scanDetailsService.storeDetails(detailsDto);
        await this.productsRepository.save(product);

        return { product, barcode_details: decoded, statusCode: 200 };
      } else {
        detailsDto.result = "GTIN Not Matched";
        detailsDto.productScanned = barcode;
        await this.scanDetailsService.storeDetails(detailsDto);
        await this.productsRepository.save(product);
        return {
          product: [],
          barcode_details: decoded || [],
          statusCode: 430,
        };
      }
    } catch (error) {
      return { statusCode: 404, error };
    }
  }

  async findProductByItemNumber(itemNumber: string) {
    return this.productsRepository.findOne({
      where: { itemNumber: itemNumber },
    });
  }

  async findProductBySerialNumber(SN: string) {
    console.log(SN);
    return this.productsRepository.findOne({
      where: { itemNumber: Like(`%${SN}%`) },
    });
  }

  async verifyGTIN(barcode: string, gtin: string) {
    return barcode.includes(gtin);
  }
}
