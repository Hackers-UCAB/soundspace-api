import { ILogger } from 'src/common/application/logging-handler/logger.interface';
import { ApplicationServiceDecorator } from '../application-service.decorator';
import { IApplicationService } from '../../interfaces/application-service.interface';
import { Result } from 'src/common/domain/result-handler/result';
import { LoggerDto } from 'src/common/application/logger/dto/logger.dto';
import { ServiceResponse } from '../../dto/response/service-response.dto';
import { ServiceEntry } from '../../dto/entry/service-entry.dto';

export class LoggerApplicationServiceDecorator<
  D extends ServiceEntry,
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
    const {userId, ...data} = param;
    const log: LoggerDto = {
      user: userId,
      ocurredOn: new Date(),
      operation: this.operation,
      data: `Data: {${JSON.stringify(data)}}`,
    };

    if (decorateResult.IsSuccess) {
      log.user = (log.user === 'Unkown' && decorateResult.Data?.userId) ? decorateResult.Data.userId : log.user;
      this.logger.logSuccess(log);
    } else {
      // log.user = 'Unkown';
      this.logger.logError(log);
    }
    return decorateResult;
  }
}
