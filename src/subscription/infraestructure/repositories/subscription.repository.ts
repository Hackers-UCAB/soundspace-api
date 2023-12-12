import { DataSource, Repository } from "typeorm";
import { OrmSubscripcionEntity } from "../orm-entities/subscription.entity";
import { ISubscriptionRepository } from "src/subscription/domain/repositories/subscription.repository.interface";
import { Subscription } from "src/subscription/domain/subscription";
import { OrmSubscriptionMapper } from "../mapper/orm-subscription.mapper";
import { SubscriptionId } from "src/subscription/domain/value-objects/subscription-id";


export class SubscriptionRepository extends Repository<OrmSubscripcionEntity> implements ISubscriptionRepository{

    private readonly ormSubscriptionMapper: OrmSubscriptionMapper;

    constructor(dataSource: DataSource){
        super(OrmSubscripcionEntity, dataSource.createEntityManager());
        this.ormSubscriptionMapper = new OrmSubscriptionMapper();
    }
    
    findAll() {
        throw new Error("Method not implemented.");
    }

    async findSubscriptionById(id: SubscriptionId) : Promise<Subscription>{
        const subscription = await this.findOne({
            where: {
                codigo_subscripcion: id.Id
            },
            relations: {
                usuario: true
            }
        });
        return this.ormSubscriptionMapper.toDomain(subscription);
    }

    async saveSubscription(subscription: Subscription): Promise<string> {
        const ormSubscription = this.ormSubscriptionMapper.toPersistence(subscription);
        console.log(ormSubscription);
        
        return 'null';
    }

    async findSubscriptionByValue(value: string): Promise<Subscription> {
        const subscription = await this.findOne({
            where: {
                value: value
            },
             relations: {
                 usuario: true
             }
        })
        return this.ormSubscriptionMapper.toDomain(subscription);
    }
}