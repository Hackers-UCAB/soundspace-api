import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth/infraestructure/controllers/auth.controller';
import { databaseProviders } from 'src/common/infraestructure/providers/config/dbconfig';
import { SubscriptionController } from './subscription/infraestructure/controllers/subscription.controller';
import { JwtModule } from '@nestjs/jwt';
import { servicesProvidersManager } from './common/infraestructure/providers/services/services.provider';
import { providersManager } from 'src/common/infraestructure/providers/config/providers-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SongController } from './song/infraestructure/controllers/song.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [],
      inject: [],
      useFactory:()=>{
        return {
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '1d' },
        }
      }
    })
  ],
  controllers: [AuthController, SubscriptionController, SongController],
  providers: [...databaseProviders, ...servicesProvidersManager, ...providersManager],
})
export class AppModule {}
