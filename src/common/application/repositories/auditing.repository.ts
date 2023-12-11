import { Result } from "../result-handler/result";


export interface AuditingDto{
    user: string
    ocurredOn: Date
    operation: string
    data: any
}
export interface IAuditingRepository {
    save(data: AuditingDto): Result<void>
}