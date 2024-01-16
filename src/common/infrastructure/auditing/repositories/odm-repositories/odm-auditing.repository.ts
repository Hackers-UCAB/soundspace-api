import { AuditingDto } from "src/common/application/auditing/dto/auditing.dto";
import { IAuditingRepository } from "src/common/application/repositories/auditing.repository.interface";
import { Result } from "src/common/domain/result-handler/result";


export class OdmAuditingRepository implements IAuditingRepository{
    saveAuditing(data: AuditingDto): Promise<Result<string>> {
        throw new Error("Method not implemented.");
    }
    
}