export interface AuditingDto{
    user: string
    ocurredOn: Date
    operation: string
    data: any
    success: boolean
}