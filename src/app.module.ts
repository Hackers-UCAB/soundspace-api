import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth/infraestructure/controllers/auth.controller';
import { databaseProviders } from 'src/common/infraestructure/providers/config/dbconfig';
import { SubscriptionController } from './subscription/infraestructure/controllers/subscription.controller';
import { servicesProvidersManager } from './common/infraestructure/providers/services/services.provider';
import { providersManager } from 'src/common/infraestructure/providers/config/providers-manager';
import { SongController } from './song/infraestructure/controllers/song.controller';
import { SongWsModule } from './song-ws/song-ws.module';
import { UserController } from './user/infraestructure/controllers/user.controller';
import { JwtStrategy } from './auth/infraestructure/jwt/strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot(),

    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [],
      inject: [],
      useFactory:()=>{
        return {
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '1d' },
        }
      }
    }),
    SongWsModule
  ],
  controllers: [AuthController, SubscriptionController, SongController, UserController],
  providers: [...databaseProviders, ...servicesProvidersManager, ...providersManager,  JwtStrategy, JwtModule, PassportModule],
  exports: [],
})
export class AppModule {}
