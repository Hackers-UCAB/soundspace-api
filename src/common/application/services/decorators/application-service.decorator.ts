import { Result } from "../../result-handler/result";
import { IApplicationService } from "../interfaces/application-service.interface";


export abstract class ApplicationServiceDecorator<D, R> implements IApplicationService<D, R> {
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