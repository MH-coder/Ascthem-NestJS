import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as dotenv from "dotenv";
import { QrCode } from "src/common/utiles/entity/barcode.entity";
import Platform from "src/common/utiles/entity/platform.entity";
import { User } from "src/common/utiles/entity/user.entity";
import { Roles } from "src/common/utiles/entity/roles.entity";
import Login from "src/common/utiles/entity/login.entity";
import { ScanningDetails } from "src/common/utiles/entity/scandetails.entity";
import { Verification } from "src/common/utiles/entity/token.entity";
import { Products } from "src/common/utiles/entity/products.entity";
import ErrorLogs from "src/common/utiles/entity/logs.entity";

dotenv.config();

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE } = process.env;

export const databaseConfig: TypeOrmModuleOptions = {
  type: "mysql",
  host: DB_HOST,
  port: parseInt(DB_PORT),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  entities: [
    User,
    QrCode,
    Roles,
    Platform,
    Login,
    ScanningDetails,
    Verification,
    Products,
    ErrorLogs,
  ],
  synchronize: true,
};
