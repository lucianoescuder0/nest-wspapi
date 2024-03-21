import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class ChatgptService {


  async chatGPTmessage(msjs: any){
    const openai = new OpenAI({
      apiKey: process.env['OPENAI_API_KEY'],
    });
    const chatCompletion = await openai.chat.completions.create({
      messages: msjs,
      model: 'gpt-3.5-turbo',
      temperature: 0.1
    });
    if(chatCompletion.choices.length > 0) {
      return chatCompletion.choices[0].message.content;
    }
  }

}
