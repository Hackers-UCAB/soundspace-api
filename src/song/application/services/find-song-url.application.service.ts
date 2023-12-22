import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { Result } from 'src/common/application/result-handler/result';
import { ISongRepository } from 'src/song/domain/repositories/song.repository.interface';
import { SongUrl } from 'src/song/domain/value-objects/song-url';
import { SongId } from 'src/song/domain/value-objects/song-id';

export class FindSongUrlService implements IApplicationService<string , SongId>{

    private readonly songRepository: ISongRepository;
    constructor(songRepository: ISongRepository) {
        this.songRepository = songRepository;
    }

    async execute(param: string): Promise<Result<SongId>> {
        try {
            //! Aqui ver cual devuelve el result, el service o el repository
            const url = await this.songRepository.findSongUrlById(param);
            return url
        } catch (error) {
            return Result.fail(
                null,
                404,
                'No se ha podido encontrar la cancion',
                new Error('No se ha podido encontrar la cancion'),
            );
        }
    }
}
    