import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsPositive,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateClubDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNumber()
  @IsPositive()
  participantsCount: number;

  @IsNumber()
  @IsPositive()
  guestsCount: number;

  @IsNumber()
  @IsPositive()
  economsCount: number;

  @IsNumber()
  @IsPositive()
  registrationFee: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === '1' || value === 'true' || value === true) return true;
    if (value === '0' || value === 'false' || value === false) return false;
    return Boolean(value);
  })
  isPaid?: boolean;

  @IsOptional()
  @IsString()
  shieldUrl?: string;

  @IsNotEmpty()
  @IsNumber()
  campId: number;
}
