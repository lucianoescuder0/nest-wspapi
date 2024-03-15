import { Module } from '@nestjs/common';
import { WspModule } from './modules/wsp/wsp.module';


@Module({
  imports: [WspModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
