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

    @Column('text', {
        default: SubscriptionStatusEnum.ACTIVE
    })
    status: string;

    @OneToOne(() => OrmUserEntity, (user)=> user.subscripcion)
    @JoinColumn({ name: 'usuario' })
    usuario: OrmUserEntity;
}