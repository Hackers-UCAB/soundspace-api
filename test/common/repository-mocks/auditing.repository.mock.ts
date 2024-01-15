import { AuditingDto } from "src/common/application/dto/auditing.dto";
import { IAuditingRepository } from "src/common/application/repositories/auditing.repository.interface";
import { Result } from "src/common/domain/result-handler/result";



export class AuditingRepositoryMock implements IAuditingRepository {
    async saveAuditing(data: AuditingDto): Promise<Result<string>> {
        return Result.success('Auditoria guardada correctamente', 200);
    }

    static create(){
        return new AuditingRepositoryMock();
    }
}