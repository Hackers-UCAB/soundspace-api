import { DataSource, Repository } from "typeorm";
import { OrmSubscriptionChanelEntity } from "../orm-entities/subscription-chanel.entity";
import { ISubscriptionChanelRepository } from "src/subscription/domain/repositories/subscription-chanel.repository.interface";
import { SubscriptionChanel } from "src/subscription/domain/subscription-chanel/subscription-chanel";
import { SubscriptionChanelId } from "src/subscription/domain/subscription-chanel/value-objects/subscription-chanel-id";
import { OrmSubscriptionChanelMapper } from "../mapper/orm-subscription-chanel.mapper";



export class SubscriptionChanelRepository extends Repository<OrmSubscriptionChanelEntity> implements ISubscriptionChanelRepository{
    private readonly ormSubscriptionChanelMapper: OrmSubscriptionChanelMapper;
    constructor(dataSource: DataSource){
        super(OrmSubscriptionChanelEntity, dataSource.createEntityManager());
        this.ormSubscriptionChanelMapper = new OrmSubscriptionChanelMapper();
    }
    async findSubscriptionChanelById(id: SubscriptionChanelId): Promise<SubscriptionChanel> {
        const subscriptionChanel = await this.findOne({
            where: {
                codigo_canal: id.Id
            }
        });
        return this.ormSubscriptionChanelMapper.toDomain(subscriptionChanel);
    }
    
}