import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { EmailService } from "src/common/utiles/email/email.service";
import { UserModule } from "src/modules/user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./strategy/auth.local.strategy";
import { JwtStrategy } from "./strategy/auth.jwt.strategy";
import * as dotenv from "dotenv";
import { TwilioSmsService } from "src/common/utiles/sms/twilioverify.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import Login from "src/common/utiles/entity/login.entity";

dotenv.config();
const { SECRET_KEY } = process.env;

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: SECRET_KEY,
      signOptions: { expiresIn: "1h" },
    }),
    TypeOrmModule.forFeature([Login]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    EmailService,
    LocalStrategy,
    JwtStrategy,
    TwilioSmsService,
  ],
})
export class AuthModule {}
