import { Provider } from "@nestjs/common";
import { SearchAlbumsApplicationService } from "src/album/application/services/search-albums.application.service";
import { AlbumRepository } from "src/album/infraestructure/repositories/album.repository";
import { SearchArtistsApplicationService } from "src/artist/application/services/search-artists.application.service";
import { ArtistRepository } from "src/artist/infraestructure/repositories/artist.repository";
import { ILogger } from "src/common/application/logging-handler/logger.interface";
import { SearchItemsEntryApplicationDto } from "src/common/application/search/dto/entry/search.entry.dto";
import { SearchItemsResponseApplicationDto } from "src/common/application/search/dto/response/search.response.dto";
import { AuditingCommandServiceDecorator } from "src/common/application/services/decorators/auditing-decorator/auditing-application-service.decorator";
import { LoggerApplicationServiceDecorator } from "src/common/application/services/decorators/logger-decorator/logger-application-service.service.decorator";
import { IApplicationService } from "src/common/application/services/interfaces/application-service.interface";
import { AuditingRepository } from "src/common/infraestructure/repositories/auditing.repository";
import { SearchPlaylistsApplicationService } from "src/playlist/application/services/search-playlists.application.service";
import { PlaylistRepository } from "src/playlist/infrastructure/repositories/playlist.repository";
import { SearchApplicationService } from "src/search/application/services/search.application.service";
import { SearchSongsApplicationService } from "src/song/application/services/search-songs.application.service";
import { OrmSongMapper } from "src/song/infraestructure/mapper/orm-song.mapper";
import { SongRepository } from "src/song/infraestructure/repositories/song.repository";
import { DataSource } from "typeorm";


export const searchServicesProviders: Provider[] = [
    {
        provide: 'SearchApplicationService',
        useFactory: (dataSource: DataSource, logger: ILogger) => {
          let strategies: Record<
            string,
            IApplicationService<
              SearchItemsEntryApplicationDto,
              SearchItemsResponseApplicationDto
            >
          >;
    
          strategies = {
            songs: new SearchSongsApplicationService(
              new SongRepository(dataSource, new OrmSongMapper()),
            ),
            albums: new SearchAlbumsApplicationService(
              new AlbumRepository(dataSource),
            ),
            playlists: new SearchPlaylistsApplicationService(
              new PlaylistRepository(dataSource),
            ),
            artists: new SearchArtistsApplicationService(
              new ArtistRepository(dataSource),
            ),
          };
          return new LoggerApplicationServiceDecorator(
            new AuditingCommandServiceDecorator(
              new SearchApplicationService(strategies),
              new AuditingRepository(dataSource),
              'Search Service',
              logger,
            ),
            logger,
            'Search Service',
          );
        },
        inject: ['DataSource', 'ILogger'],
      },
]