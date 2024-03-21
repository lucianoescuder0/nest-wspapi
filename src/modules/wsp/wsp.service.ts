import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { createWriteStream } from 'fs';
import { HttpService } from '@nestjs/axios';
import { ChatgptService } from './chatgpt/chatgpt.service';

@Injectable()
export class WspService {

  private accesToken: string = 'JKSADHAKJ21IYUG3AJKF435412ASDKJ';
  private myConsole = new console.Console(createWriteStream(('./logs.txt')));

  constructor(
    private readonly httpService: HttpService,
    private  chatgptService: ChatgptService,
  ) {
  }

  verifyToken(token: string, challenge: string) {
    if (!token || !challenge || token != this.accesToken) {
      throw new BadRequestException();
    }
    return challenge;
  }

 async receivedMessage(body: any) {
    try {
      console.log(body)
      const entry = body['entry'][0];
      const changes = entry['changes'][0];
      const value = changes['value'];
      const msj = value['messages'];
      if (typeof msj != 'undefined') {
        console.log("Mensaje response:" + msj)
        const text = this.getTextUser(msj[0]);
        const number = msj[0]['from'];
        const msjGPT = await this.chatgptService.chatGPTmessage(text)
        if(msjGPT) {
          this.sendMessageWhatsApp(msjGPT, number);
        } else {
          this.sendMessageWhatsApp(text, number);

        }
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
      'to': "542664613511",
      'type': 'text',
      'text': {
        'body': text,
      },
    });
    console.log("mibody: " + body);

    const response = await this.httpService.post(
      'https://graph.facebook.com/v18.0/231485483389327/messages',
      body,
      {headers: {
        "Content-Type": "application/json",
          Authorization: "Bearer process.env['TOKEN']"
        }}
    ).toPromise();
    return response.data;
  }

}
