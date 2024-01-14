import { Provider } from "@nestjs/common";
import { ILogger } from "src/common/application/logging-handler/logger.interface";
import { AuditingCommandServiceDecorator } from "src/common/application/services/decorators/auditing-decorator/auditing-application-service.decorator";
import { LoggerApplicationServiceDecorator } from "src/common/application/services/decorators/logger-decorator/logger-application-service.service.decorator";
import { AuditingRepository } from "src/common/infraestructure/repositories/auditing.repository";
import { GetRandomPromotionApplicationService } from "src/promotions/application/services/get-random-promotion.application.service";
import { PromotionRepository } from "src/promotions/infraestructure/repositories/promotion.repository";
import { DataSource } from "typeorm";


export const promotionServicesProviders: Provider[] = [
    {
        provide: 'GetRandomPromotionApplicationService',
        useFactory: (dataSource: DataSource, logger: ILogger) => {
          return new LoggerApplicationServiceDecorator(
            new AuditingCommandServiceDecorator(
              new GetRandomPromotionApplicationService(
                new PromotionRepository(dataSource)
              ),
              new AuditingRepository(dataSource),
              'Get Random Promotion',
              logger,
            ),
            logger,
            'Get Random Promotion',
          );
        },
        inject: ['DataSource', 'ILogger'],
      },
]