import { Module } from '@nestjs/common';
import { WspController } from './wsp.controller';
import { WspService } from './wsp.service';

@Module({
  controllers: [WspController],
  providers: [WspService]
})
export class WspModule {}
