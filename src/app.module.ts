import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth/infraestructure/controllers/auth.controller';
import { databaseProviders } from 'dbconfig';
import { OrmUserMapper } from './user/infraestructure/mapper/orm-user.mapper';

@Module({
  imports: [
    ConfigModule.forRoot(),

    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: process.env.DB_HOST,
    //   port: +process.env.DB_PORT,
    //   database: process.env.DB_NAME,
    //   username: process.env.DB_USERNAME,
    //   password: process.env.DB_PASSWORD,
    //   autoLoadEntities: true,
    //   synchronize: true,
    // }),

  ],
  controllers: [AuthController],
  providers: [...databaseProviders, OrmUserMapper],
})
export class AppModule {}
