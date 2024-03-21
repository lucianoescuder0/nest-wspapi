import { Module } from '@nestjs/common';
import { WspModule } from './modules/wsp/wsp.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configurationMariadb from './modules/wsp/configuration-mariadb';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({

  imports: [
    ConfigModule.forRoot({
      load: [configurationMariadb],
      envFilePath: `./env/${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          type: `mariadb`,
          host: configService.get('mariadb.host'),
          port: configService.get('mariadb.port'),
          username: configService.get('mariadb.username'),
          password: configService.get('mariadb.password'),
          database: configService.get('mariadb.database'),
          entities: configService.get('mariadb.entities'),
          synchronize: true
        };
      },
      inject: [ConfigService],
    }),
    WspModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
}
