import { AuditingDto } from "../dto/auditing.dto";
import { Result } from "../../../domain/result-handler/result";

export interface IAuditingRepository {
    saveAuditing(data: AuditingDto): Promise<Result<string>>
}