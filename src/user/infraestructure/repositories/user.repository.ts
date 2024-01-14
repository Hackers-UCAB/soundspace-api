import { DataSource, Repository } from 'typeorm';
import { OrmUserEntity } from '../orm-entities/user.entity';
import { IUserRepository } from 'src/user/domain/repositories/user.repository.interface';
import { OrmUserMapper } from '../mapper/orm-user.mapper';
import { User } from 'src/user/domain/user';
import { Result } from 'src/common/domain/result-handler/result';
import { UserId } from 'src/user/domain/value-objects/user-id';
import { IMapper } from 'src/common/application/mappers/mapper.interface';

export class UserRepository
  extends Repository<OrmUserEntity>
  implements IUserRepository
{
  private readonly ormUserMapper: IMapper<User, OrmUserEntity>;
  constructor(dataSource: DataSource, ormUserMapper: IMapper<User, OrmUserEntity>) {
    super(OrmUserEntity, dataSource.createEntityManager());
    this.ormUserMapper = ormUserMapper;
  }

  async findUserEntityById(id: string): Promise<OrmUserEntity> {
    try {
      const user = await this.findOne({
        where: {
          codigo_usuario: id,
        },
      });
      return user;
    } catch (error) {
      return null;
    }
  }

  async saveAggregate(user: User, tokens?: string[]): Promise<Result<string>> {
    let error: any;
    try {
      const ormUser = await this.ormUserMapper.toPersistence(user);
      ormUser.tokens = tokens;
      await this.save(ormUser);
    } catch (err) {
      error = err;
    } finally {
      if (error) {
        return Result.fail(
          null,
          500,
          error.message ||
            'Ha ocurrido un error inesperado creando el usuario, hable con el administrador',
          error,
        );
      }
      return Result.success('Usario registrado de forma exitosa', 200);
    }
  }

  async findUserById(id: UserId): Promise<Result<User>> {
    let response: User;
    let error: any;
    try {
      const user = await this.findOne({
        where: {
          codigo_usuario: id.Id,
        },
      });

      response = await this.ormUserMapper.toDomain(user);
    } catch (err) {
      error = err;
    } finally {
      if (error) {
        return Result.fail(
          null,
          500,
          error.message ||
            'Ha ocurrido un error inesperado creando el usuario, hable con el administrador',
          error,
        );
      }
      if (!response) {
        return Result.fail(
          null,
          404,
          'No existe el usuario',
          new Error('No existe el usuario'),
        );
      }
      return Result.success(response, 200);
    }
  }

  async deleteUserById(id: UserId): Promise<Result<string>> {
    let error: any;
    try {
      await this.delete({
        codigo_usuario: id.Id,
      });
    } catch (err) {
      error = err;
    } finally {
      if (error) {
        return Result.fail(
          null,
          500,
          error.message ||
            'Ha ocurrido un error inesperado, hable con el administrador',
          error,
        );
      }
      return Result.success('Usario eliminado de forma exitosa', 200);
    }
  }

  async updateTokens(id: UserId, token: string): Promise<Result<string>> {
    let error: any;
    let user: OrmUserEntity;
    try {
      user = await this.findOne({
        where: {
          codigo_usuario: id.Id,
        },
      });

      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      if (!user.tokens.includes(token)) {
        user.tokens.push(token);
        await this.save(user);
      }
    } catch (err) {
      error = err;
    } finally {
      if (error && !user) {
        return Result.fail(
          null,
          404,
          error.message || 'Usuario no encontrado',
          error,
        );
      }

      if (error) {
        return Result.fail(
          null,
          500,
          error.message ||
            'Ha ocurrido un error inesperado, hable con el administrador',
          error,
        );
      }
      return Result.success('Token actualizado de forma exitosa', 200);
    }
  }
}
