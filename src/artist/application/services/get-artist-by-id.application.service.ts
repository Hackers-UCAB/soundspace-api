import { Song } from 'src/song/domain/song';
import { Result } from '../../../common/application/result-handler/result';
import { IApplicationService } from '../../../common/application/services/interfaces/application-service.interface';
import { IArtistRepository } from '../../domain/repositories/artist.repository.interface';
import { ISongRepository } from 'src/song/domain/repositories/song.repository.interface';
import { IAlbumRepository } from 'src/album/domain/repositories/album.repository.interface';
import { ArtistId } from '../../domain/value-objects/artist-id';
import { GetArtistByIdEntryApplicationDto } from '../dto/entry/get-artist-by-id-entry.application.dto';
import { GetArtistByIdResponseApplicationDto } from '../dto/response/get-artist-by-id-response.application.dto';
import { Artist } from 'src/artist/domain/artist';
import { Album } from 'src/album/domain/album';

export class GetArtistByIdService
  implements
    IApplicationService<
      GetArtistByIdEntryApplicationDto,
      GetArtistByIdResponseApplicationDto
    >
{
  private readonly artistRepository: IArtistRepository;
  private readonly songRepository: ISongRepository;
  private readonly albumRepository: IAlbumRepository;

  constructor(
    artistRepository: IArtistRepository,
    songRepository: ISongRepository,
    albumRepository: IAlbumRepository,
  ) {
    this.artistRepository = artistRepository;
    this.songRepository = songRepository;
    this.albumRepository = albumRepository;
  }

  async execute(
    param: GetArtistByIdEntryApplicationDto,
  ): Promise<Result<GetArtistByIdResponseApplicationDto>> {
    //creamos el value object de Artist Id
    const artistId = ArtistId.create(param.artistId);

    //buscamos en el repositorio el artista por id
    const artistResult: Result<Artist> =
      await this.artistRepository.findArtistById(artistId);

    if (!artistResult.IsSuccess) {
      return Result.fail<GetArtistByIdResponseApplicationDto>(
        null,
        artistResult.statusCode,
        artistResult.message,
        artistResult.error,
      );
    }

    const albumResult: Result<Album[]> =
      await this.albumRepository.findAlbumsByArtist(artistId);
    
    if (!albumResult.IsSuccess) {
      return Result.fail<GetArtistByIdResponseApplicationDto>(
        null,
        albumResult.statusCode,
        albumResult.message,
        albumResult.error,
      );
    }

    let songs: {
      song: Song;
      artists: Artist[];
    }[] = [];
    for (const songId of artistResult.data.Songs.Songs) {
      const searchedSong: Result<Song> =
        await this.songRepository.findSongById(songId);

      if (!searchedSong.IsSuccess) {
        return Result.fail<GetArtistByIdResponseApplicationDto>(
          null,
          searchedSong.statusCode,
          searchedSong.message,
          searchedSong.error,
        );
      }

      const artist: Result<Artist[]> =
        await this.artistRepository.findArtistsBySongId(songId);

      if (!artist.IsSuccess) {
        return Result.fail<GetArtistByIdResponseApplicationDto>(
          null,
          artist.statusCode,
          artist.message,
          artist.error,
        );
      }
      songs.push({
        song: searchedSong.Data,
        artists: artist.Data,
      });
    }

    const responseDto: GetArtistByIdResponseApplicationDto = {
      userId: param.userId,
      artist: artistResult.Data,
      songs: songs,
      albums: albumResult.Data,
    };

    return Result.success<GetArtistByIdResponseApplicationDto>(
      responseDto,
      artistResult.statusCode,
    );
  }
}
