import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';

@Injectable()
export class WspService {

  private accesToken: string = 'JKSADHAKJ21IYUG3AJKF435412ASDKJ';

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

      const text = this.getTextUser(msj[0]);
      console.log(text);
    } catch (e) {
      console.error(e);
    }
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
