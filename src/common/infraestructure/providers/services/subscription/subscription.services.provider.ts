import { Provider } from '@nestjs/common';
import { ILogger } from 'src/common/application/logging-handler/logger.interface';
import { AuditingCommandServiceDecorator } from 'src/common/application/services/decorators/auditing-decorator/auditing-application-service.decorator';
import { LoggerApplicationServiceDecorator } from 'src/common/application/services/decorators/logger-decorator/logger-application-service.service.decorator';
import { EventBus } from 'src/common/infraestructure/events/event-bus';
import { AuditingRepository } from 'src/common/infraestructure/repositories/auditing.repository';
import { CancelSubscriptionApplicationService } from 'src/subscription/application/services/cancel-subscription.application.service';
import { CheckCloseToExpireSubscriptionsApplicationService } from 'src/subscription/application/services/check-close-to-expire-subscriptions.application.service';
import { CheckExpiredSubscriptionsApplicationService } from 'src/subscription/application/services/check-expired-subscriptions.application.service';
import { SubscriptionRepository } from 'src/subscription/infraestructure/repositories/subscription.repository';
import { IUserRepository } from 'src/user/domain/repositories/user.repository.interface';
import { UserRepository } from 'src/user/infraestructure/repositories/user.repository';
import { DataSource } from 'typeorm';

export const subscriptionServicesProviders: Provider[] = [
  {
    provide: 'CheckExpiredSubscriptionsApplicationService',
    useFactory: (
      dataSource: DataSource,
      userRepository: IUserRepository,
      logger: ILogger,
      eventBus: EventBus,
    ) => {
      return new LoggerApplicationServiceDecorator(
        new AuditingCommandServiceDecorator(
          new CheckExpiredSubscriptionsApplicationService(
            new SubscriptionRepository(dataSource),
            userRepository,
            eventBus,
          ),
          new AuditingRepository(dataSource),
          'Check Expired Subscriptions',
          logger,
        ),
        logger,
        'Check Expired Subscriptions',
      );
    },
    inject: ['DataSource','UserRepository', 'ILogger', 'EventBus'],
  },
  {
    provide: 'CheckCloseToExpireSubscriptionsApplicationService',
    useFactory: (
      dataSource: DataSource,
      logger: ILogger,
      eventBus: EventBus,
    ) => {
      return new LoggerApplicationServiceDecorator(
        new AuditingCommandServiceDecorator(
          new CheckCloseToExpireSubscriptionsApplicationService(
            new SubscriptionRepository(dataSource),
            eventBus,
          ),
          new AuditingRepository(dataSource),
          'Check Close To Expire Subscriptions',
          logger,
        ),
        logger,
        'Check Close To Expire Subscriptions',
      );
    },
    inject: ['DataSource', 'ILogger', 'EventBus'],
  },
  {
    provide: 'CancelSubscriptionService',
    useFactory: (dataSource: DataSource, userRepository: IUserRepository, logger: ILogger) => {
      return new LoggerApplicationServiceDecorator(
        new AuditingCommandServiceDecorator(
          new CancelSubscriptionApplicationService(
            new SubscriptionRepository(dataSource),
            userRepository,
          ),
          new AuditingRepository(dataSource),
          'CancelSubscriptionService',
          logger,
        ),
        logger,
        'CancelSubscriptionService',
      );
    },
    inject: ['DataSource', 'UserRepository', 'ILogger'],
  },
];
