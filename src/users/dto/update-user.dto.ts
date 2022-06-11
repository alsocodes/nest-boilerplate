import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
