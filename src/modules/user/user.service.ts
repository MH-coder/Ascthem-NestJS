import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserDto } from "../../common/utiles/dto/user.dto";
import { User } from "../../common/utiles/entity/user.entity";
import { EmailService } from "src/common/utiles/email/email.service";
import { TwilioSmsService } from "src/common/utiles/sms/twilioverify.service";
import { instanceToPlain } from "class-transformer";
import { Verification } from "src/common/utiles/entity/token.entity";
import Login from "src/common/utiles/entity/login.entity";
const bcrypt = require("bcrypt");

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Verification)
    private verifyRepository: Repository<Verification>,

    @InjectRepository(Login)
    private loginRepository: Repository<Login>,

    private emailService: EmailService,
    private smsServices: TwilioSmsService
  ) {}

  getUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  getManufactureUsers(roleId: number): Promise<User[]> {
    return this.userRepository.find({ where: { roleId } });
  }

  async registerUser(userDto: UserDto) {
    const { mobile, email, password } = userDto;

    if (email) {
      return this.registerDashboardUser(userDto);
    }
    if (mobile) {
      return this.registerMobileUser(userDto);
    }
  }

  async resendOTP(body: any) {
    const { mobile } = body;
    const user = await this.findByMobile(mobile);
    this.smsServices.sendSmsCode(mobile, "sms");
    if (user) {
      throw new HttpException("OTP Sent", HttpStatus.OK);
    }
  }

  async setPassword(body: any) {
    const { email, password, confirmPassword } = body;
    const user = await this.findByEmail(email);
    if (!user) {
      throw new HttpException("User Not Found", HttpStatus.NOT_FOUND);
    }
    //Check if confirm password matches password
    if (password !== confirmPassword) {
      throw new HttpException(
        "Passwords do not Match!",
        HttpStatus.BAD_REQUEST
      );
    } else {
      const hashedPassword = await bcrypt.hash(password, 8);
      user.password = hashedPassword;
      (user.is_verified = true), (user.is_active = true);
      this.UpdateUserbyEmail(email, user);
      throw new HttpException("Password Updated Successfully!", HttpStatus.OK);
    }
  }

  async updateUser(body: any) {
    const { last_name, first_name, name, email, mobile, gender } = body;
    const user = await this.findByMobile(mobile);
    if (!user) {
      throw new HttpException("User Not Found", HttpStatus.NOT_FOUND);
    }
    (user.last_name = last_name),
      (user.first_name = first_name),
      (user.name = name),
      (user.email = email);
    user.gender = gender;
    this.UpdateUserbyMobile(mobile, user);
    throw new HttpException("User Updated", HttpStatus.OK);
  }

  async inviteManufacturer(body: any) {
    const { email } = body;
    const mailSubject = "Registeration Email";
    //
    const content = `<p>HII, Please <a href="http://localhost:3000/auth/verify-user</p>`;
    // //Send email
    await this.emailService.sendEmail(email, mailSubject, content);
    throw new HttpException("Email Sent Successfully!", HttpStatus.OK);
  }

  async updateUserByEmail(body: any) {
    const { last_name, first_name, name, email, mobile, gender } = body;
    const user = await this.findByEmail(email);
    if (!user) {
      throw new HttpException("User Not Found", HttpStatus.NOT_FOUND);
    }
    (user.last_name = last_name),
      (user.first_name = first_name),
      (user.name = name),
      (user.mobile = mobile);
    user.gender = gender;
    this.UpdateUserbyEmail(email, user);
    throw new HttpException("User Updated", HttpStatus.OK);
  }

  async findByUsernameAndPassword(email: string) {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    if (user) {
      return user;
    }
    return null;
  }

  async registerMobileUser(userDto: UserDto) {
    const { mobile } = userDto;

    this.smsServices.sendSmsCode(mobile, "sms");
    const existingNum = await this.findByMobile(mobile);
    if (existingNum) {
      throw new HttpException("User Already Exists", HttpStatus.OK);
    }

    this.userRepository.save(instanceToPlain(userDto));
    throw new HttpException("User Registered ", HttpStatus.CREATED);
  }

  async registerDashboardUser(userDto: UserDto) {
    const { name, email, roleId } = userDto;

    userDto.roleId = roleId;
    userDto.name = name;

    const existingEmail = await this.findByEmail(email);
    if (existingEmail) {
      throw new HttpException("User Already Exists", HttpStatus.OK);
    }
    const randomToken = this.generateToken();
    const mailSubject = "Welcome to ASCTHEM!";
    //
    const content = `
            <p>Hello,</p>
            <p>Please click on the link below to set your Password:</p>
            <p><a href="http://localhost:3001/reset-password-form">Set Password</a></p>
            <br>
          `;

    // //Send email
    await this.emailService.sendEmail(email, mailSubject, content);
    await this.verifyRepository.save(
      instanceToPlain({ verification_token: randomToken })
    );
    await this.userRepository.save(instanceToPlain(userDto));
    throw new HttpException("User Registered ", HttpStatus.CREATED);
  }

  generateToken() {
    const token = Math.floor(100000 + Math.random() * 900000);
    return token.toString();
  }

  findByMobile(mobile: string) {
    return this.userRepository.findOne({ where: { mobile: mobile } });
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email: email } });
  }

  findOneByUserId(id: number) {
    return this.loginRepository.findOne({ where: { userId: id } });
  }

  findByUserId(id: number) {
    return this.userRepository.findOne({ where: { id: id } });
  }

  findOneByToken(verification_token: string) {
    return this.verifyRepository.findOne({
      where: { verification_token: verification_token },
    });
  }

  UpdateUserbyMobile(mobile: string, user: any) {
    return this.userRepository.update({ mobile: mobile }, user);
  }
  UpdateUserbyEmail(email: string, user: any) {
    return this.userRepository.update({ email: email }, user);
  }

  UpdateLoginByID(
    token: string,
    timeOut: any,
    isLoggedIn: boolean,
    checkUser: any
  ) {
    return this.loginRepository.update(
      { token, timeOut, isLoggedIn },
      checkUser
    );
  }
}
