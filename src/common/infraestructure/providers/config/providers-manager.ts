import { Provider } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtGenerator } from "src/auth/infraestructure/jwt/jwt-generator";
import { EventPublisherLoggerDecorator } from "src/common/application/events/decorators/logger-decorator/event-publisher-logger.decorator";
import { IEventPublisher } from "src/common/application/events/event-publisher.interface";
import { ILogger } from "src/common/application/logging-handler/logger.interface";
import { INotifier } from "src/common/application/notifications-handler/notifier.interface";
import { EventBus } from "src/common/infraestructure/events/event-bus";
import { FirebaseNotifier } from "src/common/infraestructure/firebase-notifications/firebase-notifier";
import { LoggerImpl } from "src/common/infraestructure/logger/logger";
import { NotifySubscriptionCreatedEvent } from "src/subscription/application/events/notify-subscription-created.event";
import { NotifySubscriptionExpiredEvent } from "src/subscription/application/events/notify-subscription-expired.event";
import { DataSource } from "typeorm";
import { UuidGenerator } from "../../uuid-generator";
import { NotifySubscriptionNearToExpiredEvent } from "src/subscription/application/events/notify-subscription-near-to-expired.event";
import { SubscriptionRepository } from "src/subscription/infraestructure/repositories/subscription.repository";
import { AzureBufferImageHelper } from "../../azure/helpers/azure-get-buffer-image.helper";
import { ISubscriptionRepository } from "src/subscription/domain/repositories/subscription.repository.interface";

export const providersManager: Provider[] = [
    {
        provide: 'IEventPublisher',
        useClass: EventBus,
    },
    {
        provide: 'INotifier',
        useClass: FirebaseNotifier,
    },
    {
        provide: 'ILogger',
        useClass: LoggerImpl,
    },
    {
        provide: 'IJwtGenerator',
        useFactory: (jwtService: JwtService) => new JwtGenerator(jwtService),
        inject: [JwtService],
    },
    {
        provide: 'IUuidGenerator',
        useFactory: () => new UuidGenerator(),
    },
    {
        provide: 'EventBus',
        useFactory: (eventPublisher: IEventPublisher, notifier: INotifier, logger: ILogger, subscriptionRepository: ISubscriptionRepository, dataSource: DataSource) => {
            //TODO: Hacer el de Auditing?
            const eventBus = new EventPublisherLoggerDecorator(eventPublisher, logger);

            //aqui subscribimos a todos los que escuchan los eventos
            eventBus.subscribe('SubscriptionExpired', [new NotifySubscriptionExpiredEvent(notifier, subscriptionRepository)]);
            eventBus.subscribe('SubscriptionCreated', [new NotifySubscriptionCreatedEvent(notifier, subscriptionRepository)]);
            eventBus.subscribe('SubscriptionNearToExpired', [new NotifySubscriptionNearToExpiredEvent(notifier, subscriptionRepository)]);

            return eventBus;
    },
        inject: ['IEventPublisher', 'INotifier', 'ILogger', 'SubscriptionRepository', 'DataSource'],
    },
    {
        provide: 'AzureBufferImageHelper',
        useFactory: () => {
          return new AzureBufferImageHelper();
        }
      }
    
]