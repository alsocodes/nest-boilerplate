import { Transform, Type } from 'class-transformer';
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
  @Transform(({ obj }) => {
    return [true, 'enabled', 'true'].indexOf(obj.isAnnotate) > -1;
  })
  isActive: string;
}
