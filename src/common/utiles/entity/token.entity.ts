import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Verification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  verification_token: string;
}
