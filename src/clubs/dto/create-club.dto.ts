import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsPositive,
  IsBoolean,
  IsOptional,
} from 'class-validator';

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
  isPaid?: boolean;

  @IsOptional()
  @IsString()
  shieldUrl?: string;

  @IsNotEmpty()
  @IsNumber()
  campId: number;
}
