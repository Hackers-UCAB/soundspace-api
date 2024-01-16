import { Model } from "mongoose";
import { AuditingDto } from "src/common/application/auditing/dto/auditing.dto";
import { IAuditingRepository } from "src/common/application/repositories/auditing.repository.interface";
import { Result } from "src/common/domain/result-handler/result";
import { OdmAuditingEntity } from "src/common/infrastructure/persistence-entities/odm-entities/odm-auditing.entity";


export class OdmAuditingRepository implements IAuditingRepository{
    private readonly auditingModel: Model<OdmAuditingEntity>;
    constructor(
        auditingModel: Model<OdmAuditingEntity>
    ){
        this.auditingModel = auditingModel;
    }
    saveAuditing(data: AuditingDto): Promise<Result<string>> {
        throw new Error("Method not implemented.");
    }
    
}