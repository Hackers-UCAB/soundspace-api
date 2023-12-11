import { IApplicationService } from "../../interfaces/application-service.interface";
import { ApplicationServiceDecorator } from "../application-service.decorator";


export class AuditingCommandServiceDecorator<D,R> extends ApplicationServiceDecorator<D,R> {
    private readonly auditing

    constructor(applicationService: IApplicationService<D, R>) {
        super(applicationService);

    }
}