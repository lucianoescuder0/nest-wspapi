import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { createWriteStream } from 'fs';

@Injectable()
export class WspService {

  private accesToken: string = 'JKSADHAKJ21IYUG3AJKF435412ASDKJ';
  private myConsole = new console.Console(createWriteStream(("./logs.txt")));

  constructor() {
  }

  verifyToken(token: string, challenge: string) {
    if (!token || !challenge || token != this.accesToken) {
      throw new BadRequestException();
    }
    return challenge;
  }

  receivedMessage(body: any) {
    try {
      const entry = body['entry'][0];
      const changes = entry['changes'][0];
      const value = changes['value'];
      const msj = value['messages'];
      if (typeof msj != 'undefined') {
        const text = this.getTextUser(msj[0]);
        this.myConsole.log(text);
        console.log(text);
      }
    } catch (e) {
      this.myConsole.error(e);
    }
    console.log("Fin fin fin")
    return 'EVENT_RECEIVED';
  }

  getTextUser(msj: any) {
    let text = '';
    const typeMsj = msj['type'];
    if (typeMsj == 'text') {
      text = (msj['text'])['body'];
    } else if (typeMsj == 'interactive') {
      const interactiveObject = msj['interactive'];
      const typeInteractive = interactiveObject['type'];
      if (typeInteractive == 'button_reply') {
        text = (interactiveObject['button_reply'])['title'];
      } else if (typeInteractive == 'list_reply') {
        text = (interactiveObject['list_reply'])['title'];
      }
    }
    return text;
  }

}
