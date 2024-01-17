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
    async saveAuditing(data: AuditingDto): Promise<Result<string>> {
        let error: any;
        try {
            const entry = new this.auditingModel({
                time: new Date(),
                operation: data.operation,
                data: data.data,
                user: data.user,
                success: data.success
            })
            await entry.save();
            // const entry = await this.auditingModel.create({
            //     time: new Date(),
            //     operation: data.operation,
            //     data: data.data,
            //     user: data.user,
            //     success: data.success
            // });
            
        } catch (err) {
            error = err;
        }finally{
            if (error){
                return Result.fail(
                    null,
                    500,
                    error.message ||
                    'Ha ocurrido un error inesperado guardando la auditoria, hable con el administrador',
                    error
                )
            }
            return Result.success('saved', 200);
        }
    }
    
}