import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsNumberString,
} from "class-validator";

export class barCodeDTO {
  @IsNotEmpty()
  @IsNumberString()
  @MaxLength(14)
  gtin: string;

  @IsNotEmpty()
  expDate: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(19)
  @Matches(/^[a-zA-Z0-9]+$/)
  lot: string;

  @IsNotEmpty()
  @IsNumber()
  qrNum: number;

  @IsNotEmpty()
  @IsNumber()
  snLength: number;
}
