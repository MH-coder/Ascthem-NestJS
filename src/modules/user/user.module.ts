import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmailService } from "src/common/utiles/email/email.service";
import Login from "src/common/utiles/entity/login.entity";
import { Verification } from "src/common/utiles/entity/token.entity";
import { TwilioSmsService } from "src/common/utiles/sms/twilioverify.service";
import { User } from "../../common/utiles/entity/user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  controllers: [UserController],
  providers: [UserService, EmailService, TwilioSmsService],
  exports: [UserService],
  imports: [TypeOrmModule.forFeature([User, Verification, Login])],
})
export class UserModule {}
