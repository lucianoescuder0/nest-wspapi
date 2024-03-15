import { TextDto } from './text-dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class MessageDto {

  @IsOptional()
  @IsString()
  form: string;

  @IsOptional()
  @IsString()
  id: string;

  @IsOptional()
  @IsNumber()
  Timestamp: number;

  @IsOptional()
  @IsString()
  type: string;

  @IsOptional()
  @Type(() => TextDto)
  text: TextDto;
}