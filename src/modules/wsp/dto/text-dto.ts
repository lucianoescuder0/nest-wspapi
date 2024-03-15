import { IsOptional, IsString } from 'class-validator';

export class TextDto {
  @IsOptional()
  @IsString()
  body: string;
}