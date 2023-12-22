import { IAuditingRepository } from 'src/common/application/repositories/auditing.repository.interface';
import { IApplicationService } from '../../interfaces/application-service.interface';
import { ApplicationServiceDecorator } from '../application-service.decorator';
import { Result } from 'src/common/application/result-handler/result';
import { AuditingDto } from 'src/common/application/dto/auditing.dto';
import { ILogger } from 'src/common/application/logging-handler/logger.interface';
import { LoggerDto } from 'src/common/application/dto/logger.dto';
import { ServiceResponse } from '../../response/service-response';

export class AuditingCommandServiceDecorator<
  D,
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
    const decorateResult: Result<R> = await super.execute(param);

    if (decorateResult.IsSuccess) {
      this.user = decorateResult.Data.userId;
    } else {
      this.user = 'Unkown';
      succes = false;
    }

    await this.Auditing(param, succes);

    return decorateResult;
  }

  private async Auditing(param: D, succes: boolean): Promise<void> {
    const entry: AuditingDto = {
      user: this.user,
      ocurredOn: new Date(),
      operation: this.operation,
      data: JSON.stringify(param),
      success: succes,
    };

    const auditingResult = await this.auditingRepository.saveAuditing(entry);

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
