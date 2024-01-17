import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { Result } from 'src/common/domain/result-handler/result';
import { IGetSongHelper } from '../interfaces/blob-helper.interface';
import { ISendSongHelper } from '../interfaces/send-song-helper.iterface';
import { PlaySongEntryApplicationDto } from '../dto/entry/play-song.entry.application.dto';
import { PlaySongResponseApplicationDto } from '../dto/response/play-song.response.application.dto';
import { ISongReferenceDomainService, SongReferenceDomainServiceDto } from 'src/song/domain/services/song-reference.domain,service';
import { UserId } from 'src/user/domain/value-objects/user-id';
import { SongId } from 'src/song/domain/value-objects/song-id';

export class PlaySongService implements IApplicationService<PlaySongEntryApplicationDto, PlaySongResponseApplicationDto>{

    private readonly getSongHelper: IGetSongHelper;
    private readonly sendSongHelper: ISendSongHelper;
    private readonly client: any
    private readonly songReference: ISongReferenceDomainService
    constructor(getSongHelper: IGetSongHelper, sendSondHelper: ISendSongHelper, client: any, songReference: ISongReferenceDomainService) {
        this.getSongHelper = getSongHelper;
        this.sendSongHelper = sendSondHelper;
        this.client = client
        this.songReference = songReference
    }

    async execute(param: PlaySongEntryApplicationDto): Promise<Result<PlaySongResponseApplicationDto>> {

        const {second, songId, userId} = param
        
        const domainValues: SongReferenceDomainServiceDto = {
            user: UserId.create(userId),
            song: SongId.create(songId)
        }

        const data = await this.songReference.execute(domainValues);

        if (!data.IsSuccess) {
            return Result.fail(null, 500, data.message, new Error(data.message));
        }
            
        const {blob} = await this.getSongHelper.getFile(data.Data.name.Path, 'cancion', second);
        
        this.sendSongHelper.sendSong(this.client, blob);
       
        const response: PlaySongResponseApplicationDto = {
            userId: userId,
            success: true
        }

        return Result.success(response,200)
        
    }
}