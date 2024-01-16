import { Result } from "src/common/domain/result-handler/result";
import { PartialSong } from "src/song/domain/parameter-object/partial-song.parameter.object";
import { ISongRepository } from 'src/song/domain/repositories/song.repository.interface';
import { SongReferenceDomainServiceDto, ISongReferenceDomainService } from "src/song/domain/services/song-reference.domain,service";
import { SongDuration } from "src/song/domain/value-objects/song-duration";
import { IUserRepository } from "src/user/domain/repositories/user.repository.interface";
import { User } from "src/user/domain/user";
import { UserRoleEnum } from "src/user/domain/value-objects/enum/user-role.enum";
import { UserRole } from "src/user/domain/value-objects/user-role";

export class SongReferenceImplementationHelper implements ISongReferenceDomainService{
    
    private readonly userRepository: IUserRepository
    private readonly songRepository: ISongRepository
    constructor(userRepository: IUserRepository, songRepository: ISongRepository) {
        this.userRepository = userRepository;
        this.songRepository = songRepository;
    }
    async execute(dto: SongReferenceDomainServiceDto): Promise<Result<PartialSong>>{
        const foundUser: Result<User> = await this.userRepository.findUserById(dto.user)
        let reference:Result<PartialSong>;
        if (foundUser.Data.Role.equals(UserRole.create(UserRoleEnum.USER))){
            reference = await this.songRepository.findUrl(dto.song)
        }else{
            reference = await this.songRepository.findPreview(dto.song)
            reference.Data.duration = SongDuration.create(95)
        }
        return reference;
    } 
}