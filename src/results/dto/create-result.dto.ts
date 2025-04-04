import {
  IsNotEmpty,
  IsNumber,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateResultItemDto } from './create-result-item.dto';

export class CreateResultDto {
  @IsNotEmpty()
  @IsNumber()
  clubId: number;

  @IsNotEmpty()
  @IsNumber()
  eventId: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateResultItemDto)
  items: CreateResultItemDto[];

  @IsOptional()
  @IsNumber()
  totalScore?: number;
}
