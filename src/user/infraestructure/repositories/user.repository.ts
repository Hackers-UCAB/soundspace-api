import { DataSource, Repository } from "typeorm";
import { User } from "../orm-entities/user.entity";
import { IUserRepository } from "src/user/domain/repositories/user.repository.interface";

export class UserRepository extends Repository<User> implements IUserRepository{
    
    constructor(dataSource: DataSource){
        super(User, dataSource.createEntityManager());
    }
    
    async findAll() {
        const user = await this.find();
        
        return user;
    }
    
}