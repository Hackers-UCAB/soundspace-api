import { IDomainService } from "src/common/domain/domain-service.interface";
import { IUserRepository } from "src/user/domain/repositories/user.repository.interface";
import { UserId } from "src/user/domain/value-objects/user-id";
import { ISongRepository, PartialSong } from "../repositories/song.repository.interface";
import { Result } from "src/common/application/result-handler/result"
import { User } from "src/user/domain/user";
import { UserRoleEnum } from "src/user/domain/value-objects/enum/user-role.enum";
import { UserRole } from "src/user/domain/value-objects/user-role";
import { SongId } from "../value-objects/song-id";
import { SongDuration } from "../value-objects/song-duration";

export interface SongReferenceDomainServiceDto {
    user: UserId
    song: SongId
}
// Este servicio deberia devovler o la referencia del preview o la referencia normal de la cancion
 export interface ISongReferenceDomainService extends IDomainService<SongReferenceDomainServiceDto ,PartialSong>{
    execute(dto: SongReferenceDomainServiceDto): Promise<Result<PartialSong>>;
 }