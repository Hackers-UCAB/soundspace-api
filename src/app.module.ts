import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth/infraestructure/controllers/auth.controller';
import { databaseProviders } from 'dbconfig';

@Module({
  imports: [
    ConfigModule.forRoot(),
  ],
  controllers: [AuthController],
  providers: [...databaseProviders],
})
export class AppModule {}
