import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { Result } from 'src/common/domain/result-handler/result';
import { ISongRepository } from 'src/song/domain/repositories/song.repository.interface';
import { IIdGenerator } from 'src/common/application/id-generator/id-generator.interface';
import { IBlobHelper } from '../interfaces/blob-helper.interface';
import { ISendSongHelper } from '../interfaces/send-song-helper.iterface';
import { PlaySongEntryApplicationDto } from '../dto/entry/play-song.entry.application.dto';
import { PlaySongResponseApplicationDto } from '../dto/response/play-song.response.application.dto';
import { IUserRepository } from 'src/user/domain/repositories/user.repository.interface';
import { ISongReferenceDomainService, SongReferenceDomainServiceDto } from 'src/song/domain/services/song-reference.domain,service';
import { UserId } from 'src/user/domain/value-objects/user-id';
import { SongId } from 'src/song/domain/value-objects/song-id';

export class PlaySongService implements IApplicationService<PlaySongEntryApplicationDto, PlaySongResponseApplicationDto>{

    private readonly getSongHelper: IBlobHelper;
    private readonly sendSongHelper: ISendSongHelper;
    private readonly client: any
    private readonly songReference: ISongReferenceDomainService
    constructor(getSongHelper: IBlobHelper, sendSondHelper: ISendSongHelper, client: any, songReference: ISongReferenceDomainService) {
        this.getSongHelper = getSongHelper;
        this.sendSongHelper = sendSondHelper;
        this.client = client
        this.songReference = songReference
    }

    async execute(param: PlaySongEntryApplicationDto): Promise<Result<PlaySongResponseApplicationDto>> {

        const {second, songId, userId, streaming} = param
        
        const domainValues: SongReferenceDomainServiceDto = {
            user: UserId.create(userId),
            song: SongId.create(songId)
        }

        const data = await this.songReference.execute(domainValues);

        if (!data.IsSuccess) {
            return Result.fail(null, 500, data.message, new Error(data.message));
        }
            
        const {blob} = await this.getSongHelper.getFile(data.Data.name.Path, 'cancion', second, data.Data.duration.Duration);
        
        this.sendSongHelper.sendSong(this.client, blob);
       
        const response: PlaySongResponseApplicationDto = {
            userId: userId,
            success: true
        }

        return Result.success(response,200)
        
    }
}