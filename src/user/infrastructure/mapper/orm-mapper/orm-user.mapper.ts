import { IMapper } from 'src/common/application/mappers/mapper.interface';
import { OrmUserEntity } from '../../persistence-entities/orm-entities/orm-user.entity';
import { User } from 'src/user/domain/user';
import { UserId } from 'src/user/domain/value-objects/user-id';
import { UserRole } from 'src/user/domain/value-objects/user-role';
import { UserRoleEnum } from 'src/user/domain/value-objects/enum/user-role.enum';
import { UserName } from 'src/user/domain/value-objects/user-name';
import { UserBirthday } from 'src/user/domain/value-objects/user-birthday';
import { UserEmail } from 'src/user/domain/value-objects/user-email';
import { UserGender } from 'src/user/domain/value-objects/user-gender';
import { UserGenderEnum } from 'src/user/domain/value-objects/enum/user-gender.enum';

export class OrmUserMapper implements IMapper<User, OrmUserEntity> {
  async toPersistence(domain: User): Promise<OrmUserEntity> {
    if (domain) {
      const ormUser = OrmUserEntity.create(
        domain.Id.Id,
        domain.Role.Role,
        domain.Name?.Name,
        domain.Email?.Email,
        domain.Birthday?.Birthday,
        domain.Gender?.Gender,
      );
      return ormUser;
    }
    return null;
  }

  async toDomain(persistence: OrmUserEntity): Promise<User> {
    if (persistence) {
      const user = User.create(
        UserId.create(persistence.codigo_usuario),
        UserRole.create(UserRoleEnum[persistence.rol]),
        persistence.nombre ? UserName.create(persistence.nombre) : null,
        persistence.fecha_nac
          ? UserBirthday.create(persistence.fecha_nac)
          : null,
        persistence.correo ? UserEmail.create(persistence.correo) : null,
        persistence.genero
          ? UserGender.create(UserGenderEnum[persistence.genero])
          : null,
      );
      return user;
    }
    return null;
  }
}
