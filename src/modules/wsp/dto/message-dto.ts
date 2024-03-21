import { TextDto } from './text-dto';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class MessageDto {

  @IsOptional()
  @IsString()
  namne?: string;
  @IsOptional()
  @IsString()
  role?: string;
  @IsOptional()
  @IsString()
  content?: string;
}