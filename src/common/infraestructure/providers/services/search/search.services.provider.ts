import { Provider } from '@nestjs/common';
import { SearchAlbumsApplicationService } from 'src/album/application/services/search-albums.application.service';
import { IAlbumRepository } from 'src/album/domain/repositories/album.repository.interface';
import { AlbumRepository } from 'src/album/infraestructure/repositories/album.repository';
import { SearchArtistsApplicationService } from 'src/artist/application/services/search-artists.application.service';
import { IArtistRepository } from 'src/artist/domain/repositories/artist.repository.interface';
import { ArtistRepository } from 'src/artist/infraestructure/repositories/artist.repository';
import { ILogger } from 'src/common/application/logging-handler/logger.interface';
import { IAuditingRepository } from 'src/common/application/repositories/auditing.repository.interface';
import { SearchItemsEntryApplicationDto } from 'src/common/application/search/dto/entry/search.entry.dto';
import { SearchItemsResponseApplicationDto } from 'src/common/application/search/dto/response/search.response.dto';
import { AuditingCommandServiceDecorator } from 'src/common/application/services/decorators/auditing-decorator/auditing-application-service.decorator';
import { LoggerApplicationServiceDecorator } from 'src/common/application/services/decorators/logger-decorator/logger-application-service.service.decorator';
import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { AuditingRepository } from 'src/common/infraestructure/auditing/repositories/auditing.repository';
import { SearchPlaylistsApplicationService } from 'src/playlist/application/services/search-playlists.application.service';
import { IPlaylistRepository } from 'src/playlist/domain/repositories/playlist.repository.interface';
import { PlaylistRepository } from 'src/playlist/infrastructure/repositories/playlist.repository';
import { SearchEntryApplicationDto } from 'src/search/application/dto/entry/search.entry.application.dto';
import { SearchResponseApplicationDto } from 'src/search/application/dto/response/search.response.application.dto';
import { SearchApplicationService } from 'src/search/application/services/search.application.service';
import { SearchSongsApplicationService } from 'src/song/application/services/search-songs.application.service';
import { ISongRepository } from 'src/song/domain/repositories/song.repository.interface';
import { OrmSongMapper } from 'src/song/infraestructure/mapper/orm-song.mapper';
import { SongRepository } from 'src/song/infraestructure/repositories/song.repository';
import { DataSource } from 'typeorm';

export const searchServicesProviders: Provider[] = [
  {
    provide: 'SearchApplicationService',
    useFactory: (
      albumRepository: IAlbumRepository,
      playlistRepository: IPlaylistRepository,
      artistRepository: IArtistRepository,
      songRepository: ISongRepository,
      auditingRepository: IAuditingRepository,
      logger: ILogger,
    ) => {
      let strategies: Record<
        string,
        IApplicationService<
          SearchItemsEntryApplicationDto,
          SearchItemsResponseApplicationDto
        >
      >;

      strategies = {
        songs: new SearchSongsApplicationService(songRepository),
        albums: new SearchAlbumsApplicationService(albumRepository),
        playlists: new SearchPlaylistsApplicationService(playlistRepository),
        artists: new SearchArtistsApplicationService(artistRepository),
      };
      return new LoggerApplicationServiceDecorator(
        new AuditingCommandServiceDecorator<
          SearchEntryApplicationDto,
          SearchResponseApplicationDto
        >(
          new SearchApplicationService(strategies),
          auditingRepository,
          'Search Service',
          logger,
        ),
        logger,
        'Search Service',
      );
    },
    inject: [
      'AlbumRepository',
      'PlaylistRepository',
      'ArtistRepository',
      'SongRepository',
      'AuditingRepository',
      'ILogger',
    ],
  },
];
