import { registerAs } from '@nestjs/config';

export default registerAs('mariadb', ()=> ({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ["dist/**/*.entity{.ts,.js}"],
  synchronize: process.env.DB_SYNC,
}))