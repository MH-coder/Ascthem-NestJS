import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class QrCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  barCode: string;

  @Column({ default: false })
  bought: boolean;

  @Column({ default: false })
  used: boolean;
}
