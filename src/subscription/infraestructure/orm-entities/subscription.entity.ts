import { OrmUserEntity } from "src/user/infraestructure/orm-entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrmSubscriptionChanelEntity } from "./subscription-chanel.entity";
import { IUserRepository } from "src/user/domain/repositories/user.repository.interface";
import { ISubscriptionChanelRepository } from "src/subscription/domain/repositories/subscription-chanel.repository.interface";
import { UserRepository } from "src/user/infraestructure/repositories/user.repository";
import { SubscriptionChanelRepository } from "../repositories/subscription-chanel.repository";

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
        userRepository: UserRepository,
        chanel: string,
        chanelRepository: SubscriptionChanelRepository
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