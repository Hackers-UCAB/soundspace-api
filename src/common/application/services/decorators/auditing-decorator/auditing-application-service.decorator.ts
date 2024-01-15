import { IAuditingRepository } from 'src/common/application/repositories/auditing.repository.interface';
import { IApplicationService } from '../../interfaces/application-service.interface';
import { ApplicationServiceDecorator } from '../application-service.decorator';
import { Result } from 'src/common/domain/result-handler/result';
import { AuditingDto } from 'src/common/application/auditing/dto/auditing.dto';
import { ILogger } from 'src/common/application/logging-handler/logger.interface';
import { LoggerDto } from 'src/common/application/logger/dto/logger.dto';
import { ServiceResponse } from '../../dto/response/service-response.dto';
import { ServiceEntry } from '../../dto/entry/service-entry.dto';

export class AuditingCommandServiceDecorator<
  D extends ServiceEntry,
  R extends ServiceResponse,
> extends ApplicationServiceDecorator<D, R> {
  private readonly auditingRepository: IAuditingRepository;
  private readonly operation: string;
  private readonly logger: ILogger;
  private user?: string = null;

  constructor(
    applicationService: IApplicationService<D, R>,
    auditingRepository: IAuditingRepository,
    operation: string,
    logger: ILogger,
  ) {
    super(applicationService);
    this.auditingRepository = auditingRepository;
    this.operation = operation;
    this.logger = logger;
  }

  async execute(param: D): Promise<Result<R>> {
    let succes: boolean = true;
    this.user = param.userId;
    const decorateResult: Result<R> = await super.execute(param);

    if (decorateResult.IsSuccess) {
      this.user = (this.user === 'Unkown' && decorateResult.Data?.userId) ? decorateResult.Data.userId : this.user;
    } else {
      succes = false;
    }
    
    await this.Auditing(param, succes);

    return decorateResult;
  }

  private async Auditing(param: D, succes: boolean): Promise<void> {
    const {userId, ...data} = param;
    const entry: AuditingDto = {
      user: this.user,
      ocurredOn: new Date(),
      operation: this.operation,
      data: JSON.stringify(data),
      success: succes,
    };

    const auditingResult = await this.auditingRepository.saveAuditing(entry);
    //TODO: Aca no se pues. Osea de alguna forma deberiamos saber si los requerimientos no funcionales estan fallando
    if (!auditingResult.IsSuccess) {
      const log: LoggerDto = {
        user: 'Admin',
        ocurredOn: new Date(),
        operation: 'Saving auditing',
        data: `Data: {${JSON.stringify(param)}}`,
      };
      this.logger.logError(log);
    }
  }
}
