import { DataSource, Repository } from "typeorm";
import { OrmUserEntity } from "../orm-entities/user.entity";
import { IUserRepository } from "src/user/domain/repositories/user.repository.interface";

export class UserRepository extends Repository<OrmUserEntity> implements IUserRepository{
    
    constructor(dataSource: DataSource){
        super(OrmUserEntity, dataSource.createEntityManager());
    }
    
    async findAll() {
        const user = await this.find();
        
        return user;
    }
    
}