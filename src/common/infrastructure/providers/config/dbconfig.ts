import { AlbumRepository } from 'src/album/infrastructure/repositories/album.repository';
import { ArtistRepository } from 'src/artist/infrastructure/repositories/artist.repository';
import { PlaylistRepository } from 'src/playlist/infrastructure/repositories/playlist.repository';
import { PromotionRepository } from 'src/promotions/infrastructure/repositories/promotion.repository';
import { OrmSongMapper } from 'src/song/infrastructure/mapper/orm-song.mapper';
import { SongRepository } from 'src/song/infrastructure/repositories/song.repository';
import { SubscriptionRepository } from 'src/subscription/infrastructure/repositories/subscription.repository';
import { UserRepository } from 'src/user/infrastructure/repositories/user.repository';
import { DataSource, getMetadataArgsStorage } from 'typeorm';
import { AuditingRepository } from '../../auditing/repositories/auditing.repository';
import { OrmUserMapper } from 'src/user/infrastructure/mapper/orm-user.mapper';
import { OrmSubscriptionMapper } from 'src/subscription/infrastructure/mapper/orm-subscription.mapper';
import { OrmSubscriptionChanelMapper } from 'src/subscription/infrastructure/mapper/orm-subscription-chanel.mapper';
import { OrmAlbumMapper } from 'src/album/infrastructure/mapper/orm-album.mapper';
import { OrmArtistMapper } from 'src/artist/infrastructure/mapper/orm-artist.mapper';
import { OrmPlaylistMapper } from 'src/playlist/infrastructure/mapper/orm-playlist.mapper';
import { OrmPromotionMapper } from 'src/promotions/infrastructure/mapper/orm-promotion.mapper';

export const databaseProviders = [
  {
    provide: 'DataSource',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: getMetadataArgsStorage().tables.map((table) => table.target),
        //entities: ['dist/src/**/*.entity.js', 'dist/src/**/*.entity.enum.js'],
        //entities: [__dirname + '/**/*.entity{.ts,.js}'],
        // entities: ['dist/**/*.entity{.ts,.js}'],
        ssl: {
          rejectUnauthorized: false,
        },
        synchronize: true,
      });

      try {
        if (!dataSource.isInitialized) {
          await dataSource.initialize();
        }
      } catch (error) {
        console.error(error?.message);
      }

      return dataSource;
    },
  },
  {
    provide: 'UserRepository',
    useFactory: (dataSource: DataSource) => {
      return new UserRepository(dataSource, new OrmUserMapper());
    },
    inject: ['DataSource'],
  },
  {
    provide: 'SongRepository',
    useFactory: (dataSource: DataSource) => {
      return new SongRepository(dataSource, new OrmSongMapper());
    },
    inject: ['DataSource'],
  },
  {
    provide: 'SubscriptionRepository',
    useFactory: (dataSource: DataSource) => {
      return new SubscriptionRepository(dataSource, new OrmSubscriptionMapper(dataSource), new OrmSubscriptionChanelMapper());
    },
    inject: ['DataSource'],
  },
  {
    provide: 'AlbumRepository',
    useFactory: (dataSource: DataSource) => {
      return new AlbumRepository(dataSource, new OrmAlbumMapper());
    },
    inject: ['DataSource'],
  },
  {
    provide: 'ArtistRepository',
    useFactory: (dataSource: DataSource) => {
      return new ArtistRepository(dataSource, new OrmArtistMapper());
    },
    inject: ['DataSource'],
  },
  {
    provide: 'PlaylistRepository',
    useFactory: (dataSource: DataSource) => {
      return new PlaylistRepository(dataSource, new OrmPlaylistMapper());
    },
    inject: ['DataSource'],
  },
  {
    provide: 'PromotionRepository',
    useFactory: (dataSource: DataSource) => {
      return new PromotionRepository(dataSource, new OrmPromotionMapper());
    },
    inject: ['DataSource'],
  },
  {
    provide: 'AuditingRepository',
    useFactory: (dataSource: DataSource) => {
      return new AuditingRepository(dataSource);
    },
    inject: ['DataSource'],
  },
];
