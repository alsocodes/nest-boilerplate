import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Name of user',
    required: true,
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Email of user',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password of user',
    required: true,
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
