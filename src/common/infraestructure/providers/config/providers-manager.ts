import { Provider } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtGenerator } from "src/auth/infraestructure/jwt-generator";
import { EventPublisherLoggerDecorator } from "src/common/application/events/decorators/logger-decorator/event-publisher-logger.decorator";
import { IEventPublisher } from "src/common/application/events/event-publisher.interface";
import { ILogger } from "src/common/application/logging-handler/logger.interface";
import { INotifier } from "src/common/application/notifications-handler/notifier.interface";
import { EventBus } from "src/common/infraestructure/events/event-bus";
import { FirebaseNotifier } from "src/common/infraestructure/firebase-notifications/firebase-notifier";
import { LoggerImpl } from "src/common/infraestructure/logger/logger";
import { NotifySubscriptionCreatedEvent } from "src/subscription/application/events/notify-subscription-created-event";
import { NotifySubscriptionExpiredEvent } from "src/subscription/application/events/notify-subscription-expired-event";
import { SubscriptionChanelRepository } from "src/subscription/infraestructure/repositories/subscription-chanel.repository";
import { DataSource } from "typeorm";
import { UuidGenerator } from "../../uuid-generator";

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
        useFactory: (eventPublisher: IEventPublisher, notifier: INotifier, logger: ILogger, dataSource: DataSource) => {
            const eventBus = new EventPublisherLoggerDecorator(eventPublisher, logger);

            //aqui subscribimos a todos los que escuchan los eventos
            eventBus.subscribe('SubscriptionExpired', [new NotifySubscriptionExpiredEvent(notifier)]);
            eventBus.subscribe('SubscriptionCreated', [new NotifySubscriptionCreatedEvent(notifier, new SubscriptionChanelRepository(dataSource))]);

            return eventBus;
    },
        inject: ['IEventPublisher', 'INotifier', 'ILogger', 'DataSource'],
    },
    
]