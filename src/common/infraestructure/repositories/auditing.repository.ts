import { DataSource, Repository } from "typeorm";
import { OrmAuditingEntity } from "../orm-entities/auditing.entity";
import { AuditingDto, IAuditingRepository } from "src/common/application/repositories/auditing.repository.interface";
import { Result } from "src/common/application/result-handler/result";
import { UuidGenerator } from "../uuid-generator";

export class AuditingRepository extends Repository<OrmAuditingEntity> implements IAuditingRepository{

    constructor(dataSource: DataSource){
        super(OrmAuditingEntity, dataSource.createEntityManager())
    }
    async saveAuditing(data: AuditingDto): Promise<Result<string>> {
        const generator = new UuidGenerator();
        const entry: OrmAuditingEntity = {
            auditing_id: generator.generate(),
            time: new Date(),
            Operation: data.operation,
            Data: data.data
        }
        await this.save(entry);
        return Result.success('saved', 200);
    } 
} 