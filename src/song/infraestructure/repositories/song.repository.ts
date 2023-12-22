import { DataSource, Repository } from 'typeorm';
import { Result } from 'src/common/application/result-handler/result';
import { OrmCancionEntity } from '../orm-entities/song.entity';
import { ISongRepository } from 'src/song/domain/repositories/song.repository.interface';
import { SongUrl } from 'src/song/domain/value-objects/song-url';
import { SongId } from 'src/song/domain/value-objects/song-id';

export class SongRepository extends Repository<OrmCancionEntity> implements ISongRepository{

  constructor(dataSource: DataSource) {
    super(OrmCancionEntity, dataSource.createEntityManager());
  }

  async findSongUrlById(id: string): Promise<Result<SongId>> {
    const song = await this.findOne(
        {
            where: {
               codigo_cancion: id 
            },
            select: ['codigo_cancion']
        });
    
    return Result.success(SongId.create(song.codigo_cancion),200);
  }
}