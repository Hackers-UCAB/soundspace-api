import { IMapper } from "src/common/application/mappers/mapper.interface";
import { User } from "src/user/domain/user";
import { OdmUserEntity } from "../../persistence-entities/odm-entities/odm-user.entity";


export class OdmUserMapper implements IMapper<User, OdmUserEntity>{
    toDomain(persistence: OdmUserEntity): Promise<User> {
        throw new Error("Method not implemented.");
    }
    toPersistence(domain: User): Promise<OdmUserEntity> {
        throw new Error("Method not implemented.");
    }
}