import { Result } from "../../result-handler/result";
import { IApplicationService } from "../interfaces/application-service.interface";
import { ServiceResponse } from "../response/service-response";


export abstract class ApplicationServiceDecorator<D, R extends ServiceResponse> implements IApplicationService<D, R> {
    protected readonly applicationService: IApplicationService<D, R>;
    
    constructor(applicationService: IApplicationService<D, R>) {
        this.applicationService = applicationService;
    }
    get name(): string {
        return this.applicationService.constructor.name;
    }
    async execute(param: D): Promise<Result<R>> {
        return this.applicationService.execute(param);
    }
}