import { OrmUserEntity } from "src/user/infrastructure/persistence-entities/orm-entities/orm-user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrmSubscriptionChanelEntity } from "./orm-subscription-chanel.entity";
import { OrmUserRepository } from "src/user/infrastructure/repositories/orm-repositories/orm-user.repository";
import { OrmSubscriptionRepository } from "../../repositories/orm-repositories/orm-subscription.repository";

export enum SubscriptionStatusEnum {
    ACTIVE = "ACTIVE",
    EXPIRED = "EXPIRED",
    CANCELED = "CANCELED"
}

@Entity('subscripcion')
export class OrmSubscripcionEntity {
    @PrimaryGeneratedColumn('uuid')
    codigo_subscripcion: string;

    @Column()
    fecha_creacion: Date;

    @Column()
    fecha_finalizacion: Date;

    @Column('text', {unique: true})
    value: string

    @Column('text', {
        default: SubscriptionStatusEnum.ACTIVE
    })
    status: string;

    @OneToOne(() => OrmUserEntity, (user)=> user.subscripcion)
    @JoinColumn({ name: 'usuario' })
    usuario: OrmUserEntity;

    @ManyToOne(() => OrmSubscriptionChanelEntity, (canal)=> canal.subscripciones)
    canal: OrmSubscriptionChanelEntity;

    static async create(
        subscriptionId: string,
        subscriptionStatus: string,
        subscriptionCreatedDate: Date,
        subscriptionEndDate: Date,
        value: string,
        user: string,
        userRepository: OrmUserRepository,
        chanel: string,
        chanelRepository: OrmSubscriptionRepository
    ): Promise<OrmSubscripcionEntity>{
        const subscription = new OrmSubscripcionEntity();
        subscription.codigo_subscripcion = subscriptionId;
        subscription.status = subscriptionStatus;
        subscription.fecha_creacion = subscriptionCreatedDate;
        subscription.fecha_finalizacion = subscriptionEndDate;
        subscription.value = value
        subscription.usuario = await userRepository.findUserEntityById(user) || null
        subscription.canal = await chanelRepository.findSubscriptionChanelEntityById(chanel) || null
        return subscription;
    }
}