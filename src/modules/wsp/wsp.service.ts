import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { createWriteStream } from 'fs';
import { HttpService } from '@nestjs/axios';
import { ChatgptService } from './chatgpt/chatgpt.service';
import { MessagesDto } from './dto/messages-dto';
import { MessageDto } from './dto/message-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Empresas } from './entity/empresas.entity';
import { Repository } from 'typeorm';
import { Empleados } from './entity/empleados.entity';

@Injectable()
export class WspService {

  private arrayMsg: MessagesDto[] = [];

  private msjSystem: MessageDto = new MessageDto();

  private accesToken: string = 'JKSADHAKJ21IYUG3AJKF435412ASDKJ';
  private myConsole = new console.Console(createWriteStream(('./logs.txt')));

  constructor(
    @InjectRepository(Empresas) private empresasRepository: Repository<Empresas>,
    @InjectRepository(Empleados) private empleadosRepository: Repository<Empleados>,
    private readonly httpService: HttpService,
    private chatgptService: ChatgptService,
  ) {
    this.msjSystem.role = 'system'
    this.msjSystem.content = 'Eres la empresa runaID y tus empleados estan dentro del objeto Empelados, en el estan: el nombre, los horarios y un objeto ubicacion que dentro del mismo estan las ubicaciones donde trabajan combinar los atributos calle, edificio, numero, piso y ciudad. Asi sabras a quien enviar para resolver el problema, necesitas pedir nombre, apellido, telefono y ubicacion del cliente para buscar el empleado de la empresa runaID que este en la ubicacion mas cercana. Tu conocimiento lo obtienes basada en la información que te voy a entregar, basado en los tres ticks.  '
    this.msjSystem.content += '```'

    this.getEmpresas()


  }

  async getEmpresas(){
    const empleados = await this.empleadosRepository.find({
      where: {empresa: await this.empresasRepository.findOne({where:{nombre: "runaID"}})}
    })
    console.log(empleados)
    this.msjSystem.content += empleados

    this.msjSystem.content += '```Al tener toda la informacion del cliente, buscar el empleado ideal, a esto lo puedes lograr iterando el arranglo basado en los tres ticks .Tienes que responder de clara y preguntar mas especifico si no entiendes. Debes responder siempre en español.'

  }

  verifyToken(token: string, challenge: string) {
    console.log(this.msjSystem.content)
    if (!token || !challenge || token != this.accesToken) {
      throw new BadRequestException();
    }
    return challenge;
  }

  async receivedMessage(body: any) {
    try {

      const entry = body['entry'][0];

      const changes = entry['changes'][0];
      const value = changes['value'];
      const msj = value['messages'];
      if (typeof msj != 'undefined') {

        const text = this.getTextUser(msj[0]);
        const numero = msj[0]['from'];
        const msjDto = new MessageDto()
        msjDto.role = 'user'
        msjDto.content = text
        let msjsByNumero = this.arrayMsg.findIndex(e => e.numero == numero);
        if (msjsByNumero >= 0) {
          this.arrayMsg[msjsByNumero].messages.push(msjDto)
        } else {
          const msjsDto = new MessagesDto()
          msjsDto.numero = numero
          msjsDto.messages = []
          msjsDto.messages.push(this.msjSystem)
          msjsDto.messages.push(msjDto)
          this.arrayMsg.push(msjsDto)
        }
        msjsByNumero = this.arrayMsg.findIndex(e => e.numero == numero)
        const msjGPT = await this.chatgptService.chatGPTmessage(this.arrayMsg[msjsByNumero].messages);
        if (msjGPT) {
          const msjAsis = new MessageDto()
          msjAsis.role = 'assistant'
          msjAsis.content = msjGPT

          this.arrayMsg[msjsByNumero].messages.push(msjAsis)
          this.sendMessageWhatsApp(msjGPT, numero);
        } else {
          this.sendMessageWhatsApp("¿Puede ser mas especifico?", numero);

        }
        return msjGPT

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

  async sendMessageWhatsApp(text: string, numero: string) {
    const body = JSON.stringify({
      'messaging_product': 'whatsapp',
      'to': '542664613511',
      'type': 'text',
      'text': {
        'body': text,
      },
    });

    const response = await this.httpService.post(
      'https://graph.facebook.com/v18.0/231485483389327/messages',
      body,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer EABsZBWpyaORcBO7tISKUfVIlpCyi1bkfKbeTs6TvuZAXz20YZCJfrkGZABZBDB8erg9jo0MUwWl1MdvsiijXV0D06wFzMbqUJbXnNsk1NrSBsGltZCF7Sa9F4NICFKz8npaweJzgIec5W9tqJZAfkPGVQR15L2403CqfOx2ZA1LZB8ZBCokr6XsRdrEO0KPFOit8nL',
        },
      },
    ).toPromise();
    return response.data;
  }

}
