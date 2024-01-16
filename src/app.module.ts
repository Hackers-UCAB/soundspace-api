import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth/infrastructure/controllers/auth.controller';
import { databaseProviders } from 'src/common/infrastructure/providers/config/dbconfig';
import { SubscriptionController } from './subscription/infrastructure/controllers/subscription.controller';
import { providersManager } from 'src/common/infrastructure/providers/config/providers-manager';
import { SongController } from './song/infrastructure/controllers/song.controller';
import { SongWsModule } from './song-ws/song-ws.module';
import { PlaylistController } from './playlist/infrastructure/controllers/playlist.controller';
import { AlbumController } from './album/infrastructure/controllers/album.controller';
import { UserController } from './user/infrastructure/controllers/user.controller';
import { JwtStrategy } from './auth/infrastructure/jwt/strategies/jwt.strategy';
import { ScheduleModule } from '@nestjs/schedule';
import { CheckSubscriptionsCronService } from './subscription/infrastructure/cron/subscriptions.cron';
import { PromotionController } from './promotions/infrastructure/controllers/promotion.controller';
import { SearchController } from './search/infrastructure/controllers/search.controller';
import { ArtistController } from './artist/infrastructure/controllers/artist.controller';
import { artistServicesProviders } from './common/infrastructure/providers/services/artist/artist.services.provider';
import { albumServicesProviders } from './common/infrastructure/providers/services/album/album.services.provider';
import { playlistServicesProviders } from './common/infrastructure/providers/services/playlist/playlist.services.provider';
import { songServicesProviders } from './common/infrastructure/providers/services/song/song.services.provider';
import { searchServicesProviders } from './common/infrastructure/providers/services/search/search.services.provider';
import { promotionServicesProviders } from './common/infrastructure/providers/services/promotion/promotion.services.provider';
import { authServicesProviders } from './common/infrastructure/providers/services/auth/auth.services.provider';
import { userServicesProviders } from './common/infrastructure/providers/services/user/user.services.provider';
import { subscriptionServicesProviders } from './common/infrastructure/providers/services/subscription/subscription.services.provider';

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
    ...providersManager,
    ...artistServicesProviders,
    ...albumServicesProviders,
    ...playlistServicesProviders,
    ...songServicesProviders,
    ...searchServicesProviders,
    ...promotionServicesProviders,
    ...authServicesProviders,
    ...userServicesProviders,
    ...subscriptionServicesProviders,
    JwtStrategy,
    JwtModule,
    PassportModule,
    CheckSubscriptionsCronService,
  ],
  exports: [],
})
export class AppModule {}
