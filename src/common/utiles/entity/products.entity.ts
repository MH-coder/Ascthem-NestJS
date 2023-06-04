import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from "typeorm";
import { ScanningDetails } from "./scandetails.entity";

@Entity()
export class Products {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  clientId: number;

  @Column()
  @Unique(["itemNumber"])
  itemNumber: string;

  @Column()
  NDC: string;

  @Column()
  drugNameProprietary: string;

  @Column()
  drugNameEstablished: string;

  @Column()
  dosageStrength: string;

  @Column()
  dosageForm: string;

  @Column()
  quantity: number;

  @Column()
  packageType: string;

  @Column()
  batchNumber: string;

  @Column()
  expirationDate: Date;

  @Column()
  manufacturerName: string;

  @Column()
  manufacturerAddress: string;

  @Column()
  manufacturingSite: string;

  @Column()
  specialPromotions: string;

  @Column()
  moreInformation: string;

  @Column({ default: 0 })
  scan_count: number;
}
