import { ILogger } from "src/common/application/logging-handler/logger.interface";
import { ApplicationServiceDecorator } from "../application-service.decorator";
import { IApplicationService } from "../../interfaces/application-service.interface";
import { Result } from "src/common/application/result-handler/result";


export class LoggerApplicationServiceDecorator<D, R> extends ApplicationServiceDecorator<D, R> {
    private readonly logger: ILogger;
    private readonly operation: string;

    constructor(applicationService: IApplicationService<D, R>, logger: ILogger, operation: string) {
        super(applicationService);
        this.logger = logger;
        this.operation = operation;
    }

    async execute(param: D): Promise<Result<R>> {
        this.logger.execute({
            user: 'admin',
            ocurredOn: new Date(),
            operation: this.operation,
            data: param
        });
        return await super.execute(param);
    }
}