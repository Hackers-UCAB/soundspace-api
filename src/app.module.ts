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
import { PlaylistController } from './playlist/infrastructure/controllers/playlist.controller';
import { AlbumController } from './album/infraestructure/controllers/album.controller';
import { UserController } from './user/infraestructure/controllers/user.controller';
import { JwtStrategy } from './auth/infraestructure/jwt/strategies/jwt.strategy';
import { ScheduleModule } from '@nestjs/schedule';
import { CheckSubscriptionsCronService } from './subscription/infraestructure/cron/subscriptions.cron';
import { PromotionController } from './promotions/infraestructure/controllers/promotion.controller';
import { SearchController } from './search/infraestructure/controllers/search.controller';
import { ArtistController } from './artist/infraestructure/controllers/artist.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),

    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [],
      inject: [],
      useFactory: () => {
        return {
          secret: process.env.JWT_SECRET,
          // signOptions: { expiresIn: '1d' },
          signOptions: {},
        };
      },
    }),
    SongWsModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [
    AuthController,
    SubscriptionController,
    SongController,
    UserController,
    PromotionController,
    PlaylistController,
    AlbumController,
    SearchController,
    ArtistController
  ],
  providers: [
    ...databaseProviders,
    ...servicesProvidersManager,
    ...providersManager,
    JwtStrategy,
    JwtModule,
    PassportModule,
    CheckSubscriptionsCronService,
  ],
  exports: [],
})
export class AppModule {}
