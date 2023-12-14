import { DataSource, Repository } from "typeorm";
import { OrmUserEntity } from "../orm-entities/user.entity";
import { IUserRepository } from "src/user/domain/repositories/user.repository.interface";
import { OrmUserMapper } from "../mapper/orm-user.mapper";
import { User } from "src/user/domain/user";
import { OrmSubscripcionEntity } from "src/subscription/infraestructure/orm-entities/subscription.entity";

export class UserRepository extends Repository<OrmUserEntity> implements IUserRepository{
    
    private readonly ormUsermapper: OrmUserMapper
    constructor(dataSource: DataSource){
        super(OrmUserEntity, dataSource.createEntityManager());
        this.ormUsermapper = new OrmUserMapper();
    }
    
    async findAll() {
        const user = await this.find();
        
        return user;
    }

    async findUserByPhone(phone: string): Promise<User> {
        // const user = await this.findOne({
        //     where: {telefono: phone},
        // });
        // return this.ormUsermapper.toDomain(user);
        return null;
    }
    
}