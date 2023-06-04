import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity";

@Entity()
export class ScanningDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn()
  user: User;

  @Column()
  userId: number;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column()
  email: string;

  @Column()
  timeofscan: string;

  @Column()
  location: string;

  @Column()
  productScanned: string;

  @Column({ nullable: true, type: "decimal", precision: 15, scale: 7 })
  latitude: number;

  @Column({ nullable: true, type: "decimal", precision: 15, scale: 7 })
  longitude: number;

  @Column()
  result: string;
}
