import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DetailsDto } from "src/common/utiles/dto/details.dto";
import { ScanningDetails } from "src/common/utiles/entity/scandetails.entity";
import { Repository } from "typeorm";

@Injectable()
export class ScanDetailsService {
  @InjectRepository(ScanningDetails)
  private scanDetailsRepository: Repository<ScanningDetails>;

  async getScanData(sort: string, column: string): Promise<ScanningDetails[]> {
    const queryBuilder =
      this.scanDetailsRepository.createQueryBuilder("scanning_details");

    // Apply sorting based on the column name
    if (sort && column) {
      const order = sort === "asc" ? "ASC" : "DESC";
      queryBuilder.orderBy(`scanning_details.${column}`, order);
    }

    const scanData = await queryBuilder.getMany();
    return scanData;
  }

  async storeDetails(detailsDto: DetailsDto) {
    await this.scanDetailsRepository.save(detailsDto);
  }
}
