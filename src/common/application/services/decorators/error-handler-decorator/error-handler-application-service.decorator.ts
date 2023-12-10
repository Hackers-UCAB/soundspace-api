import { Result } from "src/common/application/result-handler/result";
import { IApplicationService } from "../../interfaces/application-service.interface";
import { ApplicationServiceDecorator } from "../application-service.decorator";


export class ErrorHandlerApplicationServiceDecorator<D, R> extends ApplicationServiceDecorator<D, R> {
    constructor(applicationService: IApplicationService<D, R>) {
        super(applicationService);
    }
    async execute(param: D): Promise<Result<R>> {
        try {
            return await super.execute(param);
            
        } catch (error) {
            // console.log(`Hola en ${this.constructor.name}`);
             console.log(error);
            return Result.fail(null, 500, 'hola', error);
            
        }
    }
}