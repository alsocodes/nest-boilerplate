import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'also',
  database: 'rest_api_002',
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  synchronize: true,
};
