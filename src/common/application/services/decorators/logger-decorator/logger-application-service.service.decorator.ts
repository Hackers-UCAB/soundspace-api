import { ILogger } from 'src/common/application/logging-handler/logger.interface';
import { ApplicationServiceDecorator } from '../application-service.decorator';
import { IApplicationService } from '../../interfaces/application-service.interface';
import { Result } from 'src/common/application/result-handler/result';
import { IAuditingRepository } from 'src/common/application/repositories/auditing.repository.interface';
import { LoggerDto } from 'src/common/application/dto/logger.dto';
import { ServiceResponse } from '../../service-response';

export class LoggerApplicationServiceDecorator<
  D,
  R extends ServiceResponse,
> extends ApplicationServiceDecorator<D, R> {
  private readonly logger: ILogger;
  private readonly operation: string;

  constructor(
    applicationService: IApplicationService<D, R>,
    logger: ILogger,
    operation: string,
  ) {
    super(applicationService);
    this.logger = logger;
    this.operation = operation;
  }

  async execute(param: D): Promise<Result<R>> {
    const decorateResult: Result<R> = await super.execute(param);

    const log: LoggerDto = {
      user: '',
      ocurredOn: new Date(),
      operation: this.operation,
      data: `Data: {${JSON.stringify(param)}}`,
    };

    if (decorateResult.IsSuccess) {
      log.user = decorateResult.Data.userId;
      this.logger.logSuccess(log);
    } else {
      log.user = 'admin';
      this.logger.logError(log);
    }
    // this.auditing.saveAuditing({
    //     user: 'admin',
    //     ocurredOn: new Date(),
    //     operation: this.operation,
    //     data:  `Data: {${JSON.stringify(param)}}`
    // })

    return decorateResult;
  }
}
