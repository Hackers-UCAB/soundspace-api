import { Result } from '../../../common/application/result-handler/result';
import { IApplicationService } from '../../../common/application/services/interfaces/application-service.interface';
import { IAlbumRepository } from '../../domain/repositories/album.repository.interface';
import { IArtistRepository } from 'src/artist/domain/repositories/artist.repository.interface';
import { AlbumId } from '../../domain/value-objects/album-id';
import { GetAlbumByIdEntryApplicationDto } from '../dto/entries/get-album-by-id-entry.application.dto';
import { GetAlbumByIdResponseApplicationDto } from '../dto/responses/get-album-by-id-response.application.dto';
import { ISongRepository } from '../../../song/domain/repositories/song.repository.interface';
import { Song } from 'src/song/domain/song';
import { Artist } from 'src/artist/domain/artist';

export class GetAlbumByIdService
  implements
    IApplicationService<
      GetAlbumByIdEntryApplicationDto,
      GetAlbumByIdResponseApplicationDto
    >
{
  private readonly albumRepository: IAlbumRepository;
  private readonly artistRepository: IArtistRepository;
  private readonly songRepository: ISongRepository;

  constructor(
    albumRepository: IAlbumRepository,
    artistRepository: IArtistRepository,
    songRepository: ISongRepository,
  ) {
    this.albumRepository = albumRepository;
    this.artistRepository = artistRepository;
    this.songRepository = songRepository;
  }

  async execute(
    param: GetAlbumByIdEntryApplicationDto,
  ): Promise<Result<GetAlbumByIdResponseApplicationDto>> {

    const albumId = AlbumId.create(param.albumId);
    const albumResult = await this.albumRepository.findAlbumById(albumId);

    if (!albumResult.IsSuccess) {
      return Result.fail<GetAlbumByIdResponseApplicationDto>(
        null,
        albumResult.statusCode,
        albumResult.message,
        albumResult.error,
      );
    }

    const creators: Result<Artist[]> =
      await this.artistRepository.findArtistsByAlbumId(albumId);

    if (!creators.IsSuccess) {
      return Result.fail<GetAlbumByIdResponseApplicationDto>(
        null,
        creators.statusCode,
        creators.message,
        creators.error,
      );
    }

    let songs: {
      song: Song;
      artists: Artist[];
    }[] = [];
    for (const songId of albumResult.data.AlbumSongs.Id) {
      const searchedSong: Result<Song> =
        await this.songRepository.findSongById(songId);

      if (!searchedSong.IsSuccess) {
        return Result.fail<GetAlbumByIdResponseApplicationDto>(
          null,
          searchedSong.statusCode,
          searchedSong.message,
          searchedSong.error,
        );
      }

      const artist: Result<Artist[]> =
        await this.artistRepository.findArtistsBySongId(songId);

      if (!artist.IsSuccess) {
        return Result.fail<GetAlbumByIdResponseApplicationDto>(
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

    const albumResponseDto: GetAlbumByIdResponseApplicationDto = {
      userId: param.userId,
      creators: creators.Data,
      album: albumResult.Data,
      songs: songs,
    };

    return Result.success(albumResponseDto, 200);
  }
}
