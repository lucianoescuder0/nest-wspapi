import { Module } from '@nestjs/common';
import { WspController } from './wsp.controller';
import { WspService } from './wsp.service';
import { HttpModule } from '@nestjs/axios';
import { ChatgptService } from './chatgpt/chatgpt.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(),
    HttpModule],
  controllers: [WspController],
  providers: [WspService, ChatgptService]
})
export class WspModule {}
