import { And } from "typeorm";
import { IArtistRepository } from "../../../artist/domain/repositories/artist.repository.interface";
import { Result } from "../../../common/application/result-handler/result";
import { IApplicationService } from "../../../common/application/services/interfaces/application-service.interface";
import { IGetBufferImageInterface } from "../../../common/domain/interfaces/get-buffer-image.interface";
import { GetSongByIdResponseApplicationDto } from "../../../song/application/dto/responses/get-song-by-id.response.application.dto";
import { ISongRepository } from "../../../song/domain/repositories/song.repository.interface";
import { IPlaylistRepository } from "../../domain/repositories/playlist.repository.interface";
import { PlaylistId } from "../../domain/value-objects/playlist-id";
import { GetPlaylistByIdEntryApplicationDto } from "../dto/entrys/get-playlist-by-id-entry.application.dto";
import { GetPlaylistByIdResponseApplicationDto } from "../dto/responses/get-playlist-by-id-response.application.dto";

export class GetPlaylistByIdService implements IApplicationService<GetPlaylistByIdEntryApplicationDto, GetPlaylistByIdResponseApplicationDto>{
    private readonly PlaylistRepository: IPlaylistRepository;
    private readonly songRepository: ISongRepository;
    private readonly artistRepository: IArtistRepository;
    private readonly getBufferImage: IGetBufferImageInterface;
    constructor(PlaylistRepository: IPlaylistRepository, songRepository: ISongRepository, artistRepository: IArtistRepository, getBufferImage: IGetBufferImageInterface) {
        this.PlaylistRepository = PlaylistRepository;
        this.songRepository = songRepository;
        this.artistRepository = artistRepository;
        this.getBufferImage = getBufferImage;
    }

    async execute(param: GetPlaylistByIdEntryApplicationDto): Promise<Result<GetPlaylistByIdResponseApplicationDto>> {
        const playlistId = PlaylistId.create(param.PlaylistId);
        const playlistResult = await this.PlaylistRepository.findPlaylistById(playlistId);
        if (!playlistResult.IsSuccess) {
            return Result.fail<GetPlaylistByIdResponseApplicationDto>(null, playlistResult.statusCode, playlistResult.message, playlistResult.error);
        }
        const imageResult = await this.getBufferImage.getFile(playlistResult.Data.Cover.Path);
        const playlistResponseDto: GetPlaylistByIdResponseApplicationDto = {
            userId: param.userId,
            id: playlistResult.Data.Id.Id,
            name: playlistResult.Data.Name.Name,
            duration: "",
            im: imageResult.Data,
            songs: []
        }
        let tiempoTotalPlaylist = 0;
        //buscamos todas las canciones relacionadas a ese playlist para crear el songResponseDto
        for (const songId of playlistResult.data.PlaylistSongs.Songs) {
            const song = await this.songRepository.findSongById(songId);
            if (!song.IsSuccess) {
                return Result.fail<GetPlaylistByIdResponseApplicationDto>(null, song.statusCode, song.message, song.error);
            }
            tiempoTotalPlaylist = tiempoTotalPlaylist +song.data.Duration.Duration;
            const songResponseDto: GetSongByIdResponseApplicationDto = {
                userId: param.userId,
                songId: song.data.Id.Id,
                name: song.data.Name.Name,
                duration: this.conversorTiempo(song.data.Duration.Duration),
                artists: [],
            };
            playlistResponseDto.songs.push(songResponseDto);
            console.log("songId service:", songId);
            const artist = await this.artistRepository.findArtistBySongId(songId);
            console.log("artist service:", artist);

            /*
            //buscamos al artista de la cancion
            for (const artistsId of playlistResponseDto.songs) {
                const artist = await this.artistRepository.findArtistBySongId(songId);
                console.log("artist service:", artist);

            }
            */

        }
        playlistResponseDto.duration = this.conversorTiempo(tiempoTotalPlaylist);
        return Result.success<GetPlaylistByIdResponseApplicationDto>(playlistResponseDto, playlistResult.statusCode);
    }

    conversorTiempo(tiempo: number): string {
        let horas=0;
        let minutos=0;
        let resultado = '';
        if (tiempo >= 3600) {
            horas = Math.floor(tiempo / 3600);
            tiempo = Math.floor(tiempo % 3600);
            resultado = resultado + horas + ':';
        }
        minutos = Math.floor(tiempo / 60);
        tiempo = Math.floor(tiempo % 60);
        resultado = resultado + (minutos < 10 && horas >0 ? '0' + minutos : minutos )+ ':';
        return resultado + (tiempo < 10 ? '0' + tiempo : tiempo);
    }

}
