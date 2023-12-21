import { DataSource, Repository } from 'typeorm';
import { Result } from 'src/common/application/result-handler/result';
import { OrmCancionEntity } from '../orm-entities/song.entity';
import { ISongRepository } from 'src/song/domain/repositories/song.repository.interface';
import { SongUrl } from 'src/song/domain/value-objects/song-url';

export class SongRepository extends Repository<OrmCancionEntity> implements ISongRepository{

  constructor(dataSource: DataSource) {
    super(OrmCancionEntity, dataSource.createEntityManager());
  }

  async findSongUrlById(id: string): Promise<Result<SongUrl>> {
    const song = await this.findOne(
        {
            where: {
               codigo_cancion: id 
            },
            select: ['referencia_cancion']
        });
    
    return Result.success(SongUrl.create(song.referencia_cancion),200);
  }
}