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

export class PlaySongService implements IApplicationService<{preview: boolean, songId: string, second: number} , responseSong>{

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

    async execute(param: {preview: boolean, songId: string, second: number}): Promise<Result<responseSong>> {
        //!Aqui tengo el preview y el second actualmente para estar a la par de lo que tiene el otro grupo

        const {preview , second, 
            songId} = param

        const url = await this.songRepository.findSongUrlById(songId);

        if (!url.IsSuccess) {
            return Result.fail(null, 500, url.message, new Error(url.message));
        }
            
        const {blob, size} = await this.getSongHelper.getFile(url.Data.Id, 'cancion', second);

        this.sendSongHelper.sendSong(this.client, blob, size, second);
            
        //!Devuelvo cualquier cosa porque solo quiero probar que funcione el  envio de la cancion realmente
        const r: responseSong = {
            userId: this.idGen.generate(),
        }

        return Result.success(r,200)
        
    }
}