import { AuditingDto } from "../dto/auditing.dto";
import { Result } from "../result-handler/result";

export interface IAuditingRepository {
    saveAuditing(data: AuditingDto): Promise<Result<string>>
}