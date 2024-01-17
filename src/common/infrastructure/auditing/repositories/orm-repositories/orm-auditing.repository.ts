import { DataSource, Repository } from 'typeorm';
import { OrmAuditingEntity } from '../../../persistence-entities/orm-entities/orm-auditing.entity';
import { IAuditingRepository } from 'src/common/application/repositories/auditing.repository.interface';
import { Result } from 'src/common/domain/result-handler/result';
import { UuidGenerator } from '../../../uuid-generator';
import { AuditingDto } from 'src/common/application/auditing/dto/auditing.dto';

export class OrmAuditingRepository
  extends Repository<OrmAuditingEntity>
  implements IAuditingRepository
{
  constructor(dataSource: DataSource) {
    super(OrmAuditingEntity, dataSource.createEntityManager());
  }
  async saveAuditing(data: AuditingDto): Promise<Result<string>> {
    let error: any;
    try {
      const entry = this.create({
        Time: new Date(),
        Operation: data.operation,
        Data: data.data,
        User: data.user,
        Success: data.success,
      });
      await this.save(entry);
    } catch (err) {
      error = err;
    } finally {
      if (error) {
        return Result.fail(
          null,
          500,
          error.message ||
            'Ha ocurrido un error inesperado guardando la auditoria, hable con el administrador',
          error,
        );
      }
      return Result.success('saved', 200);
    }
  }
}
