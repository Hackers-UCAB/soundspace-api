import { ArtistId } from '../../../artist/domain/value-objects/artist-id';
import { Result } from '../../../common/application/result-handler/result';
import { IApplicationService } from '../../../common/application/services/interfaces/application-service.interface';
import { IAlbumRepository } from '../../domain/repositories/album.repository.interface';
import { IArtistRepository } from 'src/artist/domain/repositories/artist.repository.interface';
import { AlbumId } from '../../domain/value-objects/album-id';
import { GetAlbumByIdEntryApplicationDto } from '../dto/entries/get-album-by-id-entry.application.dto';
import { GetAlbumByIdResponseApplicationDto } from '../dto/responses/get-album-by-id-response.application.dto';
import { IGetBufferImageInterface } from '../../../common/domain/interfaces/get-buffer-image.interface';
import { ISongRepository } from '../../../song/domain/repositories/song.repository.interface';
import { GetSongByIdResponseApplicationDto } from '../../../song/application/dto/responses/get-song-by-id.response.application.dto';

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
  private readonly getBufferImage: IGetBufferImageInterface;

  constructor(
    albumRepository: IAlbumRepository,
    artistRepository: IArtistRepository,
    songRepository: ISongRepository,
    getBufferImage: IGetBufferImageInterface,
  ) {
    this.albumRepository = albumRepository;
    this.artistRepository = artistRepository;
    this.songRepository = songRepository;
    this.getBufferImage = getBufferImage;
  }

  conversorTiempo(tiempo: number): string {
    let horas = 0;
    let minutos = 0;
    let resultado = '';
    if (tiempo >= 3600) {
      horas = Math.floor(tiempo / 3600);
      tiempo = Math.floor(tiempo % 3600);
      resultado = resultado + horas + ':';
    }
    minutos = Math.floor(tiempo / 60);
    tiempo = Math.floor(tiempo % 60);
    resultado =
      resultado + (minutos < 10 && horas > 0 ? '0' + minutos : minutos) + ':';
    return resultado + (tiempo < 10 ? '0' + tiempo : tiempo);
  }

  async execute(
    param: GetAlbumByIdEntryApplicationDto,
  ): Promise<Result<GetAlbumByIdResponseApplicationDto>> {
    //console.log('Entre al service');
    const albumId = AlbumId.create(param.albumId);
    const albumResult = await this.albumRepository.findAlbumById(albumId);
    //console.log('Imprimiendo albumResult:', albumResult);
    if (!albumResult.IsSuccess) {
      return Result.fail<GetAlbumByIdResponseApplicationDto>(
        null,
        albumResult.statusCode,
        albumResult.message,
        albumResult.error,
      );
    }

    const imageResult = await this.getBufferImage.getFile(
      albumResult.Data.Cover.Path,
    );

    const albumResponseDto: GetAlbumByIdResponseApplicationDto = {
      userId: param.userId,
      id: albumResult.Data.Id.Id,
      name: albumResult.Data.Name.Name,
      duration: '',
      genre: albumResult.Data.Genre.Genre,
      im: imageResult.Data,
      creators: [],
      songs: [],
    };
    let duracionAlbum = 0;
    const creators = await this.artistRepository.findArtistByAlbumId(albumId);
    for (const creator of creators.Data) {
      const creatorResponse = {
        creatorId: creator.Id.Id,
        creatorName: creator.Name.Name,
      };
      albumResponseDto.creators.push(creatorResponse);
    }
    console.log('albumResponseDto:', albumResponseDto);
    for (const songId of albumResult.data.AlbumSongs.Id) {
      const song = await this.songRepository.findSongById(songId);
      if (!song.IsSuccess) {
        return Result.fail<GetAlbumByIdResponseApplicationDto>(
          null,
          song.statusCode,
          song.message,
          song.error,
        );
      }
      duracionAlbum = duracionAlbum + song.data.Duration.Duration;
      const songResponseDto: GetSongByIdResponseApplicationDto = {
        userId: param.userId,
        songId: song.data.Id.Id,
        name: song.data.Name.Name,
        duration: this.conversorTiempo(song.data.Duration.Duration),
        artists: [],
      };
      albumResponseDto.songs.push(songResponseDto);

      const artists = await this.artistRepository.findArtistBySongId(songId);
      for (const artist of artists.Data) {
        const artistResponse = {
          id: artist.Id.Id,
          name: artist.Name.Name,
        };
        songResponseDto.artists.push(artistResponse);
      }
    }
    albumResponseDto.duration = this.conversorTiempo(duracionAlbum);
    return Result.success<GetAlbumByIdResponseApplicationDto>(
      albumResponseDto,
      albumResult.statusCode,
    );
  }
}
