import { Body, Controller, Get, Post, Query, Headers } from "@nestjs/common";
import { TwilioSmsService } from "src/common/utiles/sms/twilioverify.service";
import { UserService } from "../user/user.service";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private smsService: TwilioSmsService,
    private userService: UserService
  ) {}

  @Post("login")
  async login(
    @Body() body: { email: string; password: string }
  ): Promise<{ accessToken: string }> {
    return this.authService.newLogin(body);
  }

  @Post("/login-otp")
  async verifySmsCode(@Body() body: { phoneNumber: string; code: string }) {
    const verify = await this.smsService.verifySmsCode(
      body.phoneNumber,
      body.code
    );
    return this.authService.loginWithOtp(body, verify);
  }

  @Get("/verify-user")
  async verifyEmailCode(@Query() param: any) {
    return this.authService.verfyUser(param);
  }

  @Get("me")
  async getMe(@Headers("authorization") token: string) {
    try {
      const userData = await this.authService.getUserData(token);
      return { userData };
    } catch (error) {
      throw error;
    }
  }
}
