import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { Result } from 'src/common/application/result-handler/result';
import { ISongRepository } from 'src/song/domain/repositories/song.repository.interface';
import { SongId } from 'src/song/domain/value-objects/song-id';
import { IIdGenerator } from 'src/common/application/id-generator/id-generator.interface';

export interface responsesong{
    userId: string
    songId: string
}
export class FindSongUrlService implements IApplicationService<string , responsesong>{

    private readonly songRepository: ISongRepository;
    private readonly idGen: IIdGenerator<string>;
    constructor(songRepository: ISongRepository, idGen: IIdGenerator<string>) {
        this.songRepository = songRepository;
        this.idGen = idGen;
    }

    async execute(param: string): Promise<Result<responsesong>> {
        try {
            //! Aqui ver cual devuelve el result, el service o el repository
            const url = await this.songRepository.findSongUrlById(param);
            const r: responsesong = {
                
                userId: this.idGen.generate(),
                songId: param
            }
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
    