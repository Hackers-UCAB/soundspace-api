import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { Result } from 'src/common/application/result-handler/result';
import { ISongRepository } from 'src/song/domain/repositories/song.repository.interface';
import { IIdGenerator } from 'src/common/application/id-generator/id-generator.interface';
import { IBlobHelper } from '../interfaces/blob-helper.interface';
import { ISendSongHelper } from '../interfaces/send-song-helper.iterface';
import { PlaySongEntryApplicationDto } from '../dto/entrys/play-song.entry.application.dto';
import { PlaySongResponseApplicationDto } from '../dto/responses/play-song.response.application.dto';

export class PlaySongService implements IApplicationService<PlaySongEntryApplicationDto, PlaySongResponseApplicationDto>{

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

    async execute(param: PlaySongEntryApplicationDto): Promise<Result<PlaySongResponseApplicationDto>> {

        const {preview , second, songId, userId} = param

        const data = await this.songRepository.findPartialSongById(songId);

        if (!data.IsSuccess) {
            return Result.fail(null, 500, data.message, new Error(data.message));
        }
            
        const {blob, size, startByte} = await this.getSongHelper.getFile(data.Data.name, 'cancion', second, data.Data.duration);

        this.sendSongHelper.sendSong(this.client, blob, size, startByte, second);
        
        const response: PlaySongResponseApplicationDto = {
            userId: userId,
            success: true
        }

        return Result.success(response,200)
        
    }
}