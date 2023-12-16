// import { IAuditingRepository } from "src/common/application/repositories/auditing.repository";
// import { IApplicationService } from "../../interfaces/application-service.interface";
// import { ApplicationServiceDecorator } from "../application-service.decorator";
// import { Result } from "src/common/application/result-handler/result";


// export class AuditingCommandServiceDecorator<D,R> extends ApplicationServiceDecorator<D,R> {
//     private readonly auditingRepository: IAuditingRepository;
//     private readonly operation: string

//     constructor(applicationService: IApplicationService<D, R>, auditingRepository: IAuditingRepository) {
//         super(applicationService);
//         this.auditingRepository = auditingRepository;
//     }

//     execute(param: D): Promise<Result<R>> {
//         const r = super.execute(param);
//         this.Auditing(param);
//         return r
//     }

//     private Auditing(param: D): void {
//         const entry =  {
//             userId: this.userContext.currentUser.id,
//             timeOfExecution: this.timeProvider.now,
//             operation: this.applicationService.
//             data: JSON.stringify(command)
//         };

//         this.auditingRepository.save(entry);
//     }
// }