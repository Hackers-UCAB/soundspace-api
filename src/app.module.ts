import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth/infraestructure/controllers/auth.controller';
import { databaseProviders } from 'dbconfig';
import { SubscriptionController } from './subscription/infraestructure/controllers/subscription.controller';
import { JwtModule } from '@nestjs/jwt';
import { OrmUserMapper } from './user/infraestructure/mapper/orm-user.mapper';

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
  providers: [...databaseProviders],
})
export class AppModule {}
