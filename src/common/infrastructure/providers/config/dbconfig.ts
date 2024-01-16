import { OrmAlbumRepository } from 'src/album/infrastructure/repositories/orm-repositories/orm-album.repository';
import { OrmArtistRepository } from 'src/artist/infrastructure/repositories/orm-repositories/orm-artist.repository';
import { OrmPlaylistRepository } from 'src/playlist/infrastructure/repositories/orm-repositories/orm-playlist.repository';
import { OrmPromotionRepository } from 'src/promotions/infrastructure/repositories/orm-repositories/orm-promotion.repository';
import { OrmSongMapper } from 'src/song/infrastructure/mapper/orm-mapper/orm-song.mapper';
import { OrmSongRepository } from 'src/song/infrastructure/repositories/orm-repositories/orm-song.repository';
import { OrmSubscriptionRepository } from 'src/subscription/infrastructure/repositories/orm-repositories/orm-subscription.repository';
import { OrmUserRepository } from 'src/user/infrastructure/repositories/orm-repositories/orm-user.repository';
import { DataSource, getMetadataArgsStorage } from 'typeorm';
import { OrmAuditingRepository } from '../../auditing/repositories/orm-repositories/orm-auditing.repository';
import { OrmUserMapper } from 'src/user/infrastructure/mapper/orm-mapper/orm-user.mapper';
import { OrmSubscriptionMapper } from 'src/subscription/infrastructure/mapper/orm-mapper/orm-subscription.mapper';
import { OrmSubscriptionChanelMapper } from 'src/subscription/infrastructure/mapper/orm-mapper/orm-subscription-chanel.mapper';
import { OrmAlbumMapper } from 'src/album/infrastructure/mapper/orm-mapper/orm-album.mapper';
import { OrmArtistMapper } from 'src/artist/infrastructure/mapper/orm-mapper/orm-artist.mapper';
import { OrmPlaylistMapper } from 'src/playlist/infrastructure/mapper/orm-mapper/orm-playlist.mapper';
import { OrmPromotionMapper } from 'src/promotions/infrastructure/mapper/orm-mapper/orm-promotion.mapper';
import mongoose, { Connection, connect } from 'mongoose';
import { UserSchema } from 'src/user/infrastructure/persistence-entities/odm-entities/odm-user.entity';
import { SubscriptionSchema } from 'src/subscription/infrastructure/persistence-entities/odm-entities/odm-subscription.entity';
import { SubscriptionChanelSchema } from 'src/subscription/infrastructure/persistence-entities/odm-entities/odm-subscription-chanel.entity';
import { SongSchema } from 'src/song/infrastructure/persistence-entities/odm-entities/odm-song.entity';
import { PromotionSchema } from 'src/promotions/infrastructure/persistence-entities/odm-entities/odm-promotion.entity';
import { PlaylistSchema } from '../../persistence-entities/odm-entities/odm-playlist.entity';
import { AuditingSchema } from '../../persistence-entities/odm-entities/odm-auditing.entity';
import { GenreSchema } from '../../persistence-entities/odm-entities/odm-genre.entity';
import { ArtistSchema } from 'src/artist/infrastructure/persistence-entities/odm-entities/odm-artist.entity';

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
      return new OrmUserRepository(dataSource, new OrmUserMapper());
    },
    inject: ['DataSource'],
  },
  {
    provide: 'SongRepository',
    useFactory: (dataSource: DataSource) => {
      return new OrmSongRepository(dataSource, new OrmSongMapper());
    },
    inject: ['DataSource'],
  },
  {
    provide: 'SubscriptionRepository',
    useFactory: (dataSource: DataSource) => {
      return new OrmSubscriptionRepository(
        dataSource,
        new OrmSubscriptionMapper(dataSource),
        new OrmSubscriptionChanelMapper(),
      );
    },
    inject: ['DataSource'],
  },
  {
    provide: 'AlbumRepository',
    useFactory: (dataSource: DataSource) => {
      return new OrmAlbumRepository(dataSource, new OrmAlbumMapper());
    },
    inject: ['DataSource'],
  },
  {
    provide: 'ArtistRepository',
    useFactory: (dataSource: DataSource) => {
      return new OrmArtistRepository(dataSource, new OrmArtistMapper());
    },
    inject: ['DataSource'],
  },
  {
    provide: 'PlaylistRepository',
    useFactory: (dataSource: DataSource) => {
      return new OrmPlaylistRepository(dataSource, new OrmPlaylistMapper());
    },
    inject: ['DataSource'],
  },
  {
    provide: 'PromotionRepository',
    useFactory: (dataSource: DataSource) => {
      return new OrmPromotionRepository(dataSource, new OrmPromotionMapper());
    },
    inject: ['DataSource'],
  },
  {
    provide: 'AuditingRepository',
    useFactory: (dataSource: DataSource) => {
      return new OrmAuditingRepository(dataSource);
    },
    inject: ['DataSource'],
  },
  {
    provide: 'MongoDataSource',
    useFactory: async () => {
      try {
        const connection = await connect(process.env.MONGODB);
        //console.log(mongoose.connection.readyState);

        return connection;
      } catch (error) {
        console.log(`Error al conectar a MongoDB: ${error.message}`);
        throw error;
      }
    },
  },
  {
    provide: 'UserModel',
    useFactory: (connection) => {
      return connection.model('User', UserSchema);
    },
    inject: ['MongoDataSource'],
  },
  {
    provide: 'SubscriptionModel',
    useFactory: (connection) => {
      return connection.model('Subscription', SubscriptionSchema);
    },
    inject: ['MongoDataSource'],
  },
  {
    provide: 'SubscriptionChanelModel',
    useFactory: (connection) => {
      return connection.model('SubscriptionChanel', SubscriptionChanelSchema);
    },
    inject: ['MongoDataSource'],
  },
  {
    provide: 'SongModel',
    useFactory: (connection) => {
      return connection.model('Song', SongSchema);
    },
    inject: ['MongoDataSource'],
  },
  {
    provide: 'PromotionModel',
    useFactory: (connection) => {
      return connection.model('Promotion', PromotionSchema);
    },
    inject: ['MongoDataSource'],
  },
  {
    provide: 'PlaylistModel',
    useFactory: (connection) => {
      return connection.model('Playlist', PlaylistSchema);
    },
    inject: ['MongoDataSource'],
  },
  {
    provide: 'AuditingModel',
    useFactory: (connection) => {
      return connection.model('Auditing', AuditingSchema);
    },
    inject: ['MongoDataSource'],
  },
  {
    provide: 'GenreModel',
    useFactory: (connection) => {
      return connection.model('Genre', GenreSchema);
    },
    inject: ['MongoDataSource'],
  },
  {
    provide: 'ArtistModel',
    useFactory: (connection) => {
      return connection.model('Artist', ArtistSchema);
    },
    inject: ['MongoDataSource'],
  },
];
