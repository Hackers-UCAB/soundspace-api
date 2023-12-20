import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrmSubscripcionEntity } from "./subscription.entity";


@Entity('subscripcion_chanel')
export class OrmSubscriptionChanelEntity {
    @PrimaryGeneratedColumn('uuid')
    codigo_canal: string;

    @Column()
    nombre: string;

    @Column()
    tipo: string;

    @Column()
    url: string;

    // @OneToOne(() => OrmSubscripcionEntity, (subscripcion)=> subscripcion.canal)
    // subscripcion: OrmSubscripcionEntity;

    @OneToMany(() => OrmSubscripcionEntity, (subscripcion)=> subscripcion.canal)
    subscripciones: OrmSubscripcionEntity[];

    static create(
        id: string,
        name: string,
        type: string,
        urlValidation: string
    ): OrmSubscriptionChanelEntity{
        const subscriptionChanel = new OrmSubscriptionChanelEntity();
        subscriptionChanel.codigo_canal = id;
        subscriptionChanel.nombre = name;
        subscriptionChanel.tipo = type;
        subscriptionChanel.url = urlValidation;
        return subscriptionChanel;
    }
}