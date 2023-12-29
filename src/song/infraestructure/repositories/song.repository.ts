import { DataSource, Repository } from 'typeorm';
import { Result } from 'src/common/application/result-handler/result';
import { OrmCancionEntity } from '../orm-entities/song.entity';
import { ISongRepository, PartialSong } from 'src/song/domain/repositories/song.repository.interface';
import { SongId } from 'src/song/domain/value-objects/song-id';

export class SongRepository extends Repository<OrmCancionEntity> implements ISongRepository{

  constructor(dataSource: DataSource) {
    super(OrmCancionEntity, dataSource.createEntityManager());
  }

  async findSongUrlById(id: string): Promise<Result<SongId>> {
    let error:any
    try{
      const song = await this.findOne(
          {
              where: {
                 codigo_cancion: id 
              },
              select: ['codigo_cancion']
          });
      return Result.success(SongId.create(song.codigo_cancion),200);
    }catch(error){
      return Result.fail(
        null,
        500,
        error.message || 'Ha ocurrido un error inesperado, hable con el administrador',
        error
      );
    }
    
  }

  async findPartialSongById(id: string): Promise<Result<PartialSong>> {
    let error:any
    try{
      const song = await this.findOne(
          {
              where: {
                 codigo_cancion: id 
              },
              select: ['referencia_cancion','duracion']
          });
      return Result.success({name: song.referencia_cancion, duration: song.duracion},200);
    }catch(error){
      return Result.fail(
        null,
        500,
        error.message || 'Ha ocurrido un error inesperado, hable con el administrador',
        error
      );
    }
  }
}