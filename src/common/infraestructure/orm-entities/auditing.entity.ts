import { OrmUserEntity } from 'src/user/infraestructure/orm-entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';


@Entity('auditing')
export class OrmAuditingEntity{
    @PrimaryGeneratedColumn('uuid')
    auditing_id: string

    @Column()
    User: string;

    @Column()
    Success: boolean
    
    @Column()
    Time: Date

    @Column()
    Operation: string

    @Column()
    Data: string

}