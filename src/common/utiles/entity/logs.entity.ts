import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsString } from "class-validator";

@Entity()
export class ErrorLogs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  error_message: string;

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  timestamp: Date;
}

export default ErrorLogs;
