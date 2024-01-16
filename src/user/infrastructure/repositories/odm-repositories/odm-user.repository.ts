import { IMapper } from 'src/common/application/mappers/mapper.interface';
import { Result } from 'src/common/domain/result-handler/result';
import { IUserRepository } from 'src/user/domain/repositories/user.repository.interface';
import { User } from 'src/user/domain/user';
import { UserId } from 'src/user/domain/value-objects/user-id';
import { OdmUserEntity } from '../../persistence-entities/odm-entities/odm-user.entity';
import { Model } from 'mongoose';

export class OdmUserRepository implements IUserRepository {
  private readonly odmUserMapper: IMapper<User, OdmUserEntity>;
  private readonly userModel: Model<OdmUserEntity>;
  constructor(
    odmUserMapper: IMapper<User, OdmUserEntity>,
    userModel: Model<OdmUserEntity>,
  ) {
    this.odmUserMapper = odmUserMapper;
    this.userModel = userModel;
  }

  async saveAggregate(user: User, tokens?: string[]): Promise<Result<string>> {
    let error: any;
    try {
      const odmUser = await this.odmUserMapper.toPersistence(user);
      if (tokens) odmUser.tokens = tokens;

      const existingUser = await this.userModel.findOne({
        codigo_usuario: user.Id.Id,
      });

      if (existingUser) {
        if (odmUser.nombre) existingUser.nombre = odmUser.nombre;
        if (odmUser.correo) existingUser.correo = odmUser.correo;
        if (odmUser.genero) existingUser.genero = odmUser.genero;
        if (odmUser.fecha_nac) existingUser.fecha_nac = odmUser.fecha_nac;
        if (odmUser.rol) existingUser.rol = odmUser.rol;
      
        await existingUser.updateOne(existingUser);
      } else {
        await this.userModel.create(odmUser);
      }
      
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
      const user = await this.userModel.findOne({
        codigo_usuario: id.Id,
      });

      response = await this.odmUserMapper.toDomain(user);
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
    let count: number = 0;
    try {
      const { deletedCount } = await this.userModel.deleteOne({
        codigo_usuario: id.Id,
      });
      count = deletedCount;
    } catch (err) {
      error = err;
    } finally {
      if (error || count == 0) {
        return Result.fail(
          null,
          500,
          error.message ||
            'Ha ocurrido un error inesperado creando el usuario, hable con el administrador',
          error,
        );
      }
      return Result.success('Usario eliminado de forma exitosa', 200);
    }
  }
  async updateTokens(id: UserId, token: string): Promise<Result<string>> {
    let error: any;
    let user: OdmUserEntity;
    try {
      user = await this.userModel.findOne({
        codigo_usuario: id.Id,
      });

      if (!user.tokens.includes(token)) {
        user.tokens.push(token);
        await user.updateOne(user);
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
            'Ha ocurrido un error inesperado creando el usuario, hable con el administrador',
          error,
        );
      }
      return Result.success('Token actualizado de forma exitosa', 200);
    }
  }

  async findUserEntityById(id: string): Promise<OdmUserEntity> {
    try {
      const user = await this.userModel.findOne({
        codigo_usuario: id,
      });
      return user;
    } catch (error) {
      return null;
    }
  }
}
