import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth/infraestructure/controllers/auth.controller';
import { databaseProviders } from 'dbconfig';
import { OrmUserMapper } from './user/infraestructure/mapper/orm-user.mapper';

@Module({
  imports: [
    ConfigModule.forRoot(),
  ],
  controllers: [AuthController],
  providers: [...databaseProviders, OrmUserMapper],
})
export class AppModule {}
