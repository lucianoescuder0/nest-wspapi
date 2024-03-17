import { Module } from '@nestjs/common';
import { WspController } from './wsp.controller';
import { WspService } from './wsp.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [WspController],
  providers: [WspService]
})
export class WspModule {}
