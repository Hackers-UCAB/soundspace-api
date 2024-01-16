import { IMapper } from "src/common/application/mappers/mapper.interface";
import { User } from "src/user/domain/user";
import { OdmUserEntity } from "../../persistence-entities/odm-entities/odm-user.entity";
import { Model } from "mongoose";
import { UserId } from "src/user/domain/value-objects/user-id";
import { UserGenderEnum } from "src/user/domain/value-objects/enum/user-gender.enum";
import { UserRoleEnum } from "src/user/domain/value-objects/enum/user-role.enum";
import { UserBirthday } from "src/user/domain/value-objects/user-birthday";
import { UserEmail } from "src/user/domain/value-objects/user-email";
import { UserGender } from "src/user/domain/value-objects/user-gender";
import { UserName } from "src/user/domain/value-objects/user-name";
import { UserRole } from "src/user/domain/value-objects/user-role";


export class OdmUserMapper implements IMapper<User, OdmUserEntity>{
    private readonly userModel: Model<OdmUserEntity>
    constructor(userModel: Model<OdmUserEntity>){
        this.userModel = userModel;
    }
    async toDomain(persistence: OdmUserEntity): Promise<User> {
        if (persistence){
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
            )
            return user;
        }
        return null;
    }
    async toPersistence(domain: User): Promise<OdmUserEntity> {
        if (domain){
            const odmUser = new this.userModel({
                codigo_usuario: domain.Id.Id,
                rol: domain.Role.Role
            });
            if (domain.Name?.Name) odmUser.nombre = domain.Name.Name;
            if (domain.Email?.Email) odmUser.correo = domain.Email.Email;
            if (domain.Birthday?.Birthday) odmUser.fecha_nac = domain.Birthday.Birthday;
            if (domain.Gender?.Gender) odmUser.genero = domain.Gender.Gender;
            return odmUser;
        }
        return null;
    }
}