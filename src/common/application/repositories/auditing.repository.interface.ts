import { Result } from "../result-handler/result";


export interface AuditingDto{
    user: string
    ocurredOn: Date
    operation: string
    data: any
}
export interface IAuditingRepository {
    saveAuditing(data: AuditingDto): Promise<Result<string>>
}