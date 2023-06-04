import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { UserService } from "src/modules/user/user.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { InjectRepository } from "@nestjs/typeorm";
import Login from "src/common/utiles/entity/login.entity";
import { Repository } from "typeorm";
import { instanceToPlain } from "class-transformer";
import { User } from "src/common/utiles/entity/user.entity";
import { JwtPayload } from "jsonwebtoken";

dotenv.config();
const { SECRET_KEY } = process.env;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Login)
    private loginRepository: Repository<Login>,
    private userService: UserService,
    private jwtService: JwtService,
    private userServece: UserService
  ) {}

  // async validateUser(email: string, pass: string): Promise<any> {
  //   const user = await this.userService.findByEmail(email);
  //   if (user) {
  //     if (user.is_verified == false) {
  //       return { message: "Email Not Verified" };
  //     }
  //     // const passwordCheck = await bcrypt.compare(pass, user?.password);
  //     // if (passwordCheck) {
  //     const { ...result } = user;
  //     return result;
  //     // }
  //   }
  //   return null;
  // }

  async newLogin(body: any) {
    const { email, password } = body;
    const user = await this.userServece.findByUsernameAndPassword(email);
    if (user) {
      if (user.is_verified == false) {
        throw new HttpException("Email not verified", HttpStatus.FORBIDDEN);
      }
      const passwordCheck = await bcrypt.compare(password, user.password);
      if (passwordCheck) {
        const timeOut = new Date(Date.now() + 60 * 60 * 1000);
        const isLoggedIn = true;
        await this.userService.UpdateUserbyEmail(user.email, user);
        const token = jwt.sign({ id: user.id }, SECRET_KEY, {
          expiresIn: "1h",
        });
        const checkUser = await this.userServece.findOneByUserId(user.id);
        if (!checkUser) {
          await this.savetoLogin(
            user.email,
            user.password,
            token,
            user.id,
            timeOut,
            isLoggedIn
          );
        } else {
          checkUser.token = token;
          checkUser.timeOut = timeOut;
          await this.loginRepository.save(instanceToPlain(checkUser));
        }

        return { accessToken: token };
      }
    }
    throw new HttpException(
      "Invalid username or password",
      HttpStatus.UNAUTHORIZED
    );
  }

  async loginWithOtp(body: any, verify: any) {
    const { phoneNumber } = body;
    const user = await this.userService.findByMobile(phoneNumber);
    if (verify.verification == "pending" || verify.error) {
      throw new NotFoundException("Invalid otp");
    }
    if (user) {
      user.is_active = true;
      user.is_verified = true;
      const timeOut = new Date(Date.now() + 60 * 60 * 1000);
      const isLoggedIn = true;
      await this.userService.UpdateUserbyMobile(user.mobile, user);
      const token = jwt.sign({ id: user.id }, SECRET_KEY, {
        expiresIn: "1h",
      });

      const checkUser = await this.userServece.findOneByUserId(user.id);
      if (!checkUser) {
        await this.savetoLogin(
          user.mobile,
          user.password,
          token,
          user.id,
          timeOut,
          isLoggedIn
        );
      } else {
        checkUser.token = token;
        checkUser.timeOut = timeOut;
        await this.loginRepository.save(instanceToPlain(checkUser));
      }
      return { user, token: token };
    }
    throw new NotFoundException("User not found");
  }

  async getUserData(token: string): Promise<User> {
    if (token) {
      const tokenWithoutPrefix = token.replace("Bearer ", "");

      const decoded = jwt.decode(tokenWithoutPrefix, { complete: true });
      const { id } = decoded.payload as JwtPayload;
      const user = await this.userServece.findByUserId(id);
      if (user) {
        const userData = { ...user };
        delete userData.password;
        return userData;
      }
    }
    return null;
  }

  async verfyUser(data: any) {
    const { email, token } = data;
    const user = await this.userServece.findByEmail(email);
    if (user) {
      if (user.is_verified) {
        throw new HttpException("Email already Verified", HttpStatus.OK);
      } else {
        const validToken = await this.userServece.findOneByToken(token);
        if (validToken) {
          (user.is_verified = true), (user.is_active = true);
          await this.userService.UpdateUserbyEmail(user.email, user);
          throw new HttpException("Email Verified", HttpStatus.OK);
        }
        throw new HttpException("Invalid Token", HttpStatus.UNAUTHORIZED);
      }
    }
    throw new NotFoundException("User not found");
  }

  async logout(user: any) {
    user.logged_in = false;
    await user.save();
  }

  async savetoLogin(
    username: string,
    password: string,
    token: string,
    userId: number,
    timeOut: any,
    isLoggedIn: boolean
  ) {
    await this.loginRepository.save(
      instanceToPlain({
        username,
        password,
        token,
        userId,
        isLoggedIn,
        timeOut,
      })
    );
  }
}
