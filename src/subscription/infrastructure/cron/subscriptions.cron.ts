import { Inject } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Result } from "src/common/domain/result-handler/result";
import { ServiceResponse } from "src/common/application/services/dto/response/service-response.dto";
import { IApplicationService } from "src/common/application/services/interfaces/application-service.interface";
import { ServiceEntry } from "src/common/application/services/dto/entry/service-entry.dto";


export class CheckSubscriptionsCronService {
    constructor(
        @Inject('CheckExpiredSubscriptionsApplicationService')
        private readonly checkExpiredSubscriptionsApplicationService: IApplicationService<ServiceEntry, ServiceResponse>,
        @Inject('CheckCloseToExpireSubscriptionsApplicationService')
        private readonly checkCloseToExpireSubscriptionsApplicationService: IApplicationService<ServiceEntry, ServiceResponse>,
        ) {}
    
    //   @Cron(CronExpression.EVERY_DAY_AT_8AM)
      @Cron(CronExpression.EVERY_DAY_AT_8AM, {
        name: 'check-subscriptions',
        timeZone: 'America/Caracas',
      })
      async handleCron(){
        const checkExpiredSubscriptionResult: Result<ServiceResponse> = await this.checkExpiredSubscriptionsApplicationService.execute({userId: 'Admin'});
        if (!checkExpiredSubscriptionResult.IsSuccess) {
          console.log(checkExpiredSubscriptionResult.message);
          
          setTimeout(() => this.checkExpiredSubscriptionsApplicationService.execute({userId: 'Admin'}), 15 * 60 * 1000);
        }

        const checkCloseToExpireSubscriptionResult: Result<ServiceResponse> = await this.checkCloseToExpireSubscriptionsApplicationService.execute({userId: 'Admin'});
        if (!checkCloseToExpireSubscriptionResult.IsSuccess) {
          setTimeout(() => this.checkCloseToExpireSubscriptionsApplicationService.execute({userId: 'Admin'}), 15 * 60 * 1000);
        }
        
      }
}