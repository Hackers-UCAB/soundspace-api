import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { Result } from 'src/common/application/result-handler/result';
import { ISongRepository } from 'src/song/domain/repositories/song.repository.interface';
import { IIdGenerator } from 'src/common/application/id-generator/id-generator.interface';
import { IBlobHelper } from '../interfaces/blob-helper.interface';
import { ISendSongHelper } from '../interfaces/send-song-helper.iterface';



//!Esto esta aqui por ahora porque tengo que devolver un usuario obligatoriamente, sino me da problemas por la clase abstracta
export interface responseSong{
    userId: string
}

export class PlaySongService implements IApplicationService<string , responseSong>{

    private readonly songRepository: ISongRepository;
    private readonly idGen: IIdGenerator<string>;
    private readonly getSongHelper: IBlobHelper;
    private readonly sendSongHelper: ISendSongHelper;
    private readonly client: any
    constructor(songRepository: ISongRepository, idGen: IIdGenerator<string>, getSongHelper: IBlobHelper, sendSondHelper: ISendSongHelper, client: any ) {
        this.songRepository = songRepository;
        this.idGen = idGen;
        this.getSongHelper = getSongHelper;
        this.sendSongHelper = sendSondHelper;
        this.client = client
    }

    async execute(param: string): Promise<Result<responseSong>> {
        
        const url = await this.songRepository.findSongUrlById(param);

        if (!url.IsSuccess) {
            return Result.fail(null, 500, url.message, new Error(url.message));
        }
            
        const {blob, size} = await this.getSongHelper.getFile(url.Data.Id, 'cancion');

        this.sendSongHelper.sendSong(this.client, url.Data.Id, blob, size);
            
        //!Devuelvo cualquier cosa porque solo quiero probar que funcione el  envio de la cancion realmente
        const r: responseSong = {
            userId: this.idGen.generate(),
        }

        return Result.success(r,200)
        
    }
}