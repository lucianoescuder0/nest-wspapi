import { MessageDto } from './message-dto';
import { IsArray, IsString } from 'class-validator';

export class MessagesDto {

  @IsString()
  numero!: string;

  @IsArray()
  messages: MessageDto[] = [];


}