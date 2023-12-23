import { DataSource, Repository } from 'typeorm';
import { Result } from 'src/common/application/result-handler/result';
import { IPlaylistRepository } from 'src/Playlist/domain/repositories/Playlist.repository.interface';
import { Playlist } from '../../domain/playlist';
import { OrmPlaylistEntity } from '../../../common/infraestructure/orm-entities/playlist.entity';
import { PlaylistName } from '../../domain/value-objects/playlist-name';
import { PlaylistIdEntryApplicationDto } from '../../application/dto/entrys/playlist-id-entry.application.dto';

export class PlaylistRepository extends Repository<OrmPlaylistEntity> implements IPlaylistRepository {

    constructor(dataSource: DataSource) {
        super(OrmPlaylistEntity, dataSource.createEntityManager());
    }
    async findPlaylistById(PlaylistIdEntryDto: PlaylistIdEntryApplicationDto): Promise<Result<PlaylistName>> {
        const Playlist = await this.findOne(
            {
                where: {
                    codigo_playlist: PlaylistIdEntryDto.PlaylistId
                },
                select: ['nombre']
            });

        return Result.success(PlaylistName.create(Playlist.nombre), 200);
    }
    async findTopPlaylist(): Promise<Result<Playlist[]>> {
        throw new Error('Method not implemented.');
    }
}
