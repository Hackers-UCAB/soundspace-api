import { ILogger } from "src/common/application/logging-handler/logger.interface";
import { ApplicationServiceDecorator } from "../application-service.decorator";
import { IApplicationService } from "../../interfaces/application-service.interface";
import { Result } from "src/common/application/result-handler/result";
import { IAuditingRepository } from "src/common/application/repositories/auditing.repository.interface";


export class LoggerApplicationServiceDecorator<D, R> extends ApplicationServiceDecorator<D, R> {
    private readonly logger: ILogger;
    private readonly operation: string;
    private readonly auditing: IAuditingRepository

    constructor(applicationService: IApplicationService<D, R>, logger: ILogger, auditing: IAuditingRepository, operation: string, ) {
        super(applicationService);
        this.logger = logger;
        this.operation = operation;
        this.auditing = auditing;
    }

    async execute(param: D): Promise<Result<R>> {
        
        const r = await super.execute(param);
        this.logger.execute({
            user: 'admin',
            ocurredOn: new Date(),
            operation: this.operation,
            data:  `Data: {${JSON.stringify(param)}}`
        });

        this.auditing.saveAuditing({
            user: 'admin',
            ocurredOn: new Date(),
            operation: this.operation,
            data:  `Data: {${JSON.stringify(param)}}`
        })

        return r;
    }

}