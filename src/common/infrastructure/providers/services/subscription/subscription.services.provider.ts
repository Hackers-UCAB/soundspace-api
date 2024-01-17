import { Provider } from '@nestjs/common';
import { ILogger } from 'src/common/application/logging-handler/logger.interface';
import { IAuditingRepository } from 'src/common/application/auditing/repositories/auditing.repository.interface';
import { AuditingServiceDecorator } from 'src/common/application/services/decorators/auditing-decorator/auditing-application-service.decorator';
import { LoggerApplicationServiceDecorator } from 'src/common/application/services/decorators/logger-decorator/logger-application-service.service.decorator';
import { EventBus } from 'src/common/infrastructure/events/event-bus';
import { CancelSubscriptionApplicationService } from 'src/subscription/application/services/cancel-subscription.application.service';
import { CheckCloseToExpireSubscriptionsApplicationService } from 'src/subscription/application/services/check-close-to-expire-subscriptions.application.service';
import { CheckExpiredSubscriptionsApplicationService } from 'src/subscription/application/services/check-expired-subscriptions.application.service';
import { ISubscriptionRepository } from 'src/subscription/domain/repositories/subscription.repository.interface';
import { IUserRepository } from 'src/user/domain/repositories/user.repository.interface';


export const subscriptionServicesProviders: Provider[] = [
  {
    provide: 'CheckExpiredSubscriptionsApplicationService',
    useFactory: (
      userRepository: IUserRepository,
      subscriptionRepository: ISubscriptionRepository,
      auditingRepository: IAuditingRepository,
      logger: ILogger,
      eventBus: EventBus,
    ) => {
      return new LoggerApplicationServiceDecorator(
        new AuditingServiceDecorator(
          new CheckExpiredSubscriptionsApplicationService(
            subscriptionRepository,
            userRepository,
            eventBus,
          ),
          auditingRepository,
          'Check Expired Subscriptions',
          logger,
        ),
        logger,
        'Check Expired Subscriptions',
      );
    },
    inject: ['UserRepository', 'SubscriptionRepository', 'AuditingRepository', 'ILogger', 'EventBus'],
  },
  {
    provide: 'CheckCloseToExpireSubscriptionsApplicationService',
    useFactory: (
      subscriptionRepository: ISubscriptionRepository,
      auditingRepository: IAuditingRepository,
      logger: ILogger,
      eventBus: EventBus,
    ) => {
      return new LoggerApplicationServiceDecorator(
        new AuditingServiceDecorator(
          new CheckCloseToExpireSubscriptionsApplicationService(
           subscriptionRepository,
            eventBus,
          ),
          auditingRepository,
          'Check Close To Expire Subscriptions',
          logger,
        ),
        logger,
        'Check Close To Expire Subscriptions',
      );
    },
    inject: ['SubscriptionRepository', 'AuditingRepository', 'ILogger', 'EventBus'],
  },
  {
    provide: 'CancelSubscriptionService',
    useFactory: (userRepository: IUserRepository, subscriptionRepository: ISubscriptionRepository, auditingRepository: IAuditingRepository, logger: ILogger) => {
      return new LoggerApplicationServiceDecorator(
        new AuditingServiceDecorator(
          new CancelSubscriptionApplicationService(
            subscriptionRepository,
            userRepository,
          ),
          auditingRepository,
          'CancelSubscriptionService',
          logger,
        ),
        logger,
        'CancelSubscriptionService',
      );
    },
    inject: ['UserRepository', 'SubscriptionRepository', 'AuditingRepository', 'ILogger'],
  },
];
