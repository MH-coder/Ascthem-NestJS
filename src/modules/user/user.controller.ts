import { Body, Controller, Get, Post } from "@nestjs/common";
import { UserDto } from "../../common/utiles/dto/user.dto";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}
  @Get("user")
  getUser() {
    return this.userService.getUsers();
  }

  @Post("register")
  store(@Body() body: any) {
    return this.userService.registerUser(body);
  }

  @Post("invite-manufacturer")
  invite(@Body() body: any) {
    return this.userService.inviteManufacturer(body);
  }

  @Post("resent-otp")
  ResendOTP(@Body() body: JSON) {
    return this.userService.resendOTP(body);
  }

  @Post("set-password")
  SetPassword(@Body() body: JSON) {
    return this.userService.setPassword(body);
  }

  @Post("update")
  update(@Body() body: JSON) {
    return this.userService.updateUser(body);
  }

  @Post("update-admin")
  updateByEmail(@Body() body: JSON) {
    return this.userService.updateUserByEmail(body);
  }

  @Get("manufacturer-user")
  getManufacturerUser() {
    return this.userService.getManufactureUsers(3);
  }
}
