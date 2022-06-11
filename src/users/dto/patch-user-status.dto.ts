import { IsBoolean, IsNotEmpty } from 'class-validator';

export class PatchUserStatusDto {
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;
}
