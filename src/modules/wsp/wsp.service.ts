import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { createWriteStream } from 'fs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class WspService {

  private accesToken: string = 'JKSADHAKJ21IYUG3AJKF435412ASDKJ';
  private myConsole = new console.Console(createWriteStream(('./logs.txt')));

  constructor(
    private readonly httpService: HttpService,
  ) {
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
        const number = msj[0]['from'];
        this.sendMessageWhatsApp("Soy un loro: " + text, number);
      }
    } catch (e) {
      console.error(e);
      this.myConsole.error(e);
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

  async sendMessageWhatsApp(text: string, numberr: number) {
    const body = JSON.stringify({
      'messaging_product': 'whatsapp',
      'to': numberr,
      'type': 'text',
      'text': {
        'body': text,
      },
    });

    const response = await this.httpService.post(
      'https://graph.facebook.com/v18.0/231485483389327/messages',
      body,
      {headers: {
        "Content-Type": "application/json",
          Authorization: "Bearer EABsZBWpyaORcBO7tISKUfVIlpCyi1bkfKbeTs6TvuZAXz20YZCJfrkGZABZBDB8erg9jo0MUwWl1MdvsiijXV0D06wFzMbqUJbXnNsk1NrSBsGltZCF7Sa9F4NICFKz8npaweJzgIec5W9tqJZAfkPGVQR15L2403CqfOx2ZA1LZB8ZBCokr6XsRdrEO0KPFOit8nL"
        }}
    ).toPromise();
    return response.data;
  }

}
