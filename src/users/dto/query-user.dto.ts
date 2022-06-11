import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class QueryUserDto {
  @IsInt()
  @Type(() => Number)
  page = 1;

  @IsInt()
  @Type(() => Number)
  perPage = 20;

  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  isActive: string;
}
