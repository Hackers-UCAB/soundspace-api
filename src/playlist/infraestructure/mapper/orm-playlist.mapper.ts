import { IMapper } from 'src/common/application/mappers/mapper.interface';
import { UserId } from 'src/user/domain/value-objects/user-id';
import { DataSource } from 'typeorm';
import { UserRepository } from 'src/user/infraestructure/repositories/user.repository';
import { OrmPlaylistEntity } from '../../../common/infraestructure/orm-entities/playlist.entity';
import { Playlist } from '../../domain/Playlist';
import { PlaylistId } from '../../domain/value-objects/playlist-id';

export class OrmPlaylistMapper
    implements IMapper<Playlist, OrmPlaylistEntity>
{
    //@Inject('DataSource')
    private readonly dataSource: DataSource;
    constructor(dataSource: DataSource) {
        this.dataSource = dataSource;
    }
    //REVISAR VO PQ PUEDE QUE NO COINCIDAN CON BASE
    async toDomain(persistence: OrmPlaylistEntity): Promise<Playlist> {
        if (persistence) {
            const playlist: Playlist = await playlist.create(
                PlaylistId.create(persistence.codigo_subscripcion),
                UserId.create(persistence.usuario.codigo_usuario),
                playlistChanelId.create(persistence.canal.codigo_canal),
            );

            return playlist;
        }
        return null;
    }

    async toPersistence(domain: playlist): Promise<OrmPlaylistEntity> {
        if (domain) {

            const playlist = await OrmPlaylistEntity.create(
                domain.Id.Id,
                domain.Status.Status,
                domain.CreatedOn.Date,
                domain.Until.Date,
                domain.playlistValue.playlistValue,
                domain.User.Id,
                new UserRepository(this.dataSource),
                domain.Chanel.Id,
                new playlistChanelRepository(this.dataSource),
            );
            return playlist;
        }
        return null;
    }
}
