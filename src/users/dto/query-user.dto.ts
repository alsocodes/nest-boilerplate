import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class QueryUserDto {
  @IsInt()
  @Type(() => Number)
  page: number = 1;

  @IsInt()
  @Type(() => Number)
  perPage: number = 20;

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
