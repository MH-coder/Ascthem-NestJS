import { IsNumberString, MinLength } from "class-validator";

export class UserDto {
  name: string;

  @IsNumberString()
  @MinLength(10)
  mobile: string;

  email: string;
  password: string;
  confirmPassword: string;
  roleId: string;
  token: string;
}
