import { OrmUserEntity } from "src/user/infraestructure/orm-entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

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

    @Column()
    value: string

    @Column('text', {
        default: SubscriptionStatusEnum.ACTIVE
    })
    status: string;

    @OneToOne(() => OrmUserEntity, (user)=> user.subscripcion)
    @JoinColumn({ name: 'usuario' })
    usuario: OrmUserEntity;

    static create(
        subscriptionId: string,
        subscriptionStatus: string,
        subscriptionCreatedDate: Date,
        subscriptionEndDate: Date,
        value: string
        //user: OrmUserEntity
    ): OrmSubscripcionEntity{
        const subscription = new OrmSubscripcionEntity();
        subscription.codigo_subscripcion = subscriptionId;
        subscription.status = subscriptionStatus;
        subscription.fecha_creacion = subscriptionCreatedDate;
        subscription.fecha_finalizacion = subscriptionEndDate;
        subscription.value = value
        //subscription.usuario = user;
        return subscription;
    }
}