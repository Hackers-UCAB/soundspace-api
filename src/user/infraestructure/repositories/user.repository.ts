import { DataSource, Repository } from 'typeorm';
import { OrmUserEntity } from '../orm-entities/user.entity';
import { IUserRepository } from 'src/user/domain/repositories/user.repository.interface';
import { OrmUserMapper } from '../mapper/orm-user.mapper';
import { User } from 'src/user/domain/user';
import { UserPhone } from 'src/user/domain/value-objects/user-phone';
import { Result } from 'src/common/application/result-handler/result';

export class UserRepository
  extends Repository<OrmUserEntity>
  implements IUserRepository
{
  private readonly ormUsermapper: OrmUserMapper;
  constructor(dataSource: DataSource) {
    super(OrmUserEntity, dataSource.createEntityManager());
    this.ormUsermapper = new OrmUserMapper();
  }

  async saveAggregate(user: User): Promise<Result<string>> {
    let error: any;
    try {
      const ormUser = await this.ormUsermapper.toPersistence(user);
      await this.save(ormUser);
    } catch (err) {
      error = err;
    } finally {
      if (error) {
        return Result.fail(null, 500, error.message || 'Ha ocurrido un error inesperado creando el usuario, hable con el administrador', error);
      }
      return Result.success('Usario registrado de forma exitosa', 200);
    }
  }

  async findUserById(id: string): Promise<OrmUserEntity> {
    const user = await this.findOne({
      where: {
        codigo_usuario: id,
      },
    });
    return user;
  }

  async deleteUserById(id: string): Promise<Result<string>> {
    let error: any;
    try {
      await this.delete({
        codigo_usuario: id,
      });
    } catch (err) {
      error = err;
    } finally {
      if (error) {
        return Result.fail(null, 500, error.message || 'Ha ocurrido un error inesperado, hable con el administrador', error);
      }
      return Result.success('Usario eliminado de forma exitosa', 200);
    }
  }
   
  
}
