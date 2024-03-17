import { Body, ConflictException, Controller, Get, Post, Query } from '@nestjs/common';
import { WspService } from './wsp.service';

@Controller('/api/v1/wsp')
export class WspController {

  constructor(private wspService: WspService) {
  }

  @Get()
  verifyToken(@Query('hub.verify_token') token: string, @Query('hub.challenge') challenge: string) {
    return this.wspService.verifyToken(token, challenge);
  }

  @Post()
  receivedMessage(@Body() body: any) {
    return this.wspService.receivedMessage(body)
  }

}
