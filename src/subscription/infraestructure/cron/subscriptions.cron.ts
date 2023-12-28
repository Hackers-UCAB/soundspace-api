
import { Inject } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Result } from "src/common/application/result-handler/result";
import { ServiceResponse } from "src/common/application/services/response/service-response";
import { IApplicationService } from "src/common/application/services/interfaces/application-service.interface";
import { EmptyDto } from "src/common/application/dto/empty.dto";


export class CheckSubscriptionsCronService {
    constructor(
        @Inject('CheckExpiredSubscriptionsApplicationService')
        private readonly checkExpiredSubscriptionsApplicationService: IApplicationService<EmptyDto, ServiceResponse>,
        @Inject('CheckCloseToExpireSubscriptionsApplicationService')
        private readonly checkCloseToExpireSubscriptionsApplicationService: IApplicationService<EmptyDto, ServiceResponse>,
        ) {}
    
    //   @Cron(CronExpression.EVERY_DAY_AT_8AM)
      @Cron(CronExpression.EVERY_DAY_AT_8AM, {
        name: 'check-subscriptions',
        timeZone: 'America/Caracas',
      })
      async handleCron(){
        const checkExpiredSubscriptionResult: Result<ServiceResponse> = await this.checkExpiredSubscriptionsApplicationService.execute({});
        if (!checkExpiredSubscriptionResult.IsSuccess) {
          setTimeout(() => this.checkExpiredSubscriptionsApplicationService.execute({}), 15 * 60 * 1000);
        }

        const checkCloseToExpireSubscriptionResult: Result<ServiceResponse> = await this.checkCloseToExpireSubscriptionsApplicationService.execute({});
        if (!checkCloseToExpireSubscriptionResult.IsSuccess) {
          setTimeout(() => this.checkCloseToExpireSubscriptionsApplicationService.execute({}), 15 * 60 * 1000);
        }
        
      }
}