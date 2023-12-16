import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


@Entity('auditing')
export class OrmAuditingEntity{
    @PrimaryGeneratedColumn('uuid')
    auditing_id: string

    @Column()
    time: Date

    @Column()
    Operation: string

    @Column()
    Data: string
}