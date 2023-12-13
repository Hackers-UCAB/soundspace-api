import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth/infraestructure/controllers/auth.controller';
import { SubscriptionController } from './subscription/infraestructure/controllers/subscription.controller';
import { JwtModule } from '@nestjs/jwt';
import { providersManager } from 'providers-manager';

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
  controllers: [AuthController, SubscriptionController],
  providers: providersManager,
})
export class AppModule {}
