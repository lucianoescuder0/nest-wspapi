import { Module } from '@nestjs/common';
import { WspController } from './wsp.controller';
import { WspService } from './wsp.service';
import { HttpModule } from '@nestjs/axios';
import { ChatgptService } from './chatgpt/chatgpt.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empleados } from './entity/empleados.entity';
import { Empresas } from './entity/empresas.entity';
import { Pedidos } from './entity/pedidos.entity';
import { Ubicaciones } from './entity/ubicaciones.entity';

@Module({
  imports: [ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      Empleados,
      Empresas,
      Pedidos,
      Ubicaciones
    ]),
    HttpModule],
  controllers: [WspController],
  providers: [WspService, ChatgptService]
})
export class WspModule {}
