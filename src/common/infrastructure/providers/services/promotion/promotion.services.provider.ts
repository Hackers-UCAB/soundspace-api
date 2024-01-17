import { Provider } from "@nestjs/common";
import { ILogger } from "src/common/application/logging-handler/logger.interface";
import { IAuditingRepository } from "src/common/application/repositories/auditing.repository.interface";
import { AuditingServiceDecorator } from "src/common/application/services/decorators/auditing-decorator/auditing-application-service.decorator";
import { LoggerApplicationServiceDecorator } from "src/common/application/services/decorators/logger-decorator/logger-application-service.service.decorator";
import { GetRandomPromotionApplicationService } from "src/promotions/application/services/get-random-promotion.application.service";
import { IPromotionRepository } from "src/promotions/domain/repositories/promotion.repository.interface";


export const promotionServicesProviders: Provider[] = [
    {
        provide: 'GetRandomPromotionApplicationService',
        useFactory: (promotionRepository: IPromotionRepository, auditingRepository: IAuditingRepository, logger: ILogger) => {
          return new LoggerApplicationServiceDecorator(
            new AuditingServiceDecorator(
              new GetRandomPromotionApplicationService(
                promotionRepository
              ),
              auditingRepository,
              'Get Random Promotion',
              logger,
            ),
            logger,
            'Get Random Promotion',
          );
        },
        inject: ['PromotionRepository', 'AuditingRepository', 'ILogger'],
      },
]