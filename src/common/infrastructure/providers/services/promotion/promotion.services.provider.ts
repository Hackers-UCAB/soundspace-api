import { Provider } from "@nestjs/common";
import { ILogger } from "src/common/application/logging-handler/logger.interface";
import { AuditingCommandServiceDecorator } from "src/common/application/services/decorators/auditing-decorator/auditing-application-service.decorator";
import { LoggerApplicationServiceDecorator } from "src/common/application/services/decorators/logger-decorator/logger-application-service.service.decorator";
import { AuditingRepository } from "src/common/infraestructure/auditing/repositories/auditing.repository";
import { GetRandomPromotionApplicationService } from "src/promotions/application/services/get-random-promotion.application.service";
import { IPromotionRepository } from "src/promotions/domain/repositories/promotion.repository.interface";
import { PromotionRepository } from "src/promotions/infrastructure/repositories/promotion.repository";
import { DataSource } from "typeorm";


export const promotionServicesProviders: Provider[] = [
    {
        provide: 'GetRandomPromotionApplicationService',
        useFactory: (dataSource: DataSource, promotionRepository: IPromotionRepository, logger: ILogger) => {
          return new LoggerApplicationServiceDecorator(
            new AuditingCommandServiceDecorator(
              new GetRandomPromotionApplicationService(
                promotionRepository
              ),
              new AuditingRepository(dataSource),
              'Get Random Promotion',
              logger,
            ),
            logger,
            'Get Random Promotion',
          );
        },
        inject: ['DataSource', 'PromotionRepository', 'ILogger'],
      },
]