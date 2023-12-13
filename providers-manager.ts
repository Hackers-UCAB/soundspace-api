import { Provider } from "@nestjs/common";
import { EventPublisherLoggerDecorator } from "src/common/application/events/decorators/logger-decorator/event-publisher-logger.decorator";
import { IEventPublisher } from "src/common/application/events/event-publisher.interface";
import { ILogger } from "src/common/application/logging-handler/logger.interface";
import { INotifier } from "src/common/application/notifications-handler/notifier.interface";
import { EventBus } from "src/common/infraestructure/events/event-bus";
import { FirebaseNotifier } from "src/common/infraestructure/firebase-notifications/firebase-notifier";
import { LoggerImpl } from "src/common/infraestructure/logger/logger";
import { NotifySubscriptionCreatedEvent } from "src/subscription/application/events/notify-subscription-created-event";
import { NotifySubscriptionExpiredEvent } from "src/subscription/application/events/notify-subscription-expired-event";
import { DataSource, getMetadataArgsStorage } from "typeorm";

export const providersManager: Provider[] = [
    {
        provide: 'DataSource',
        useFactory: async () => {
          const dataSource = new DataSource({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: getMetadataArgsStorage().tables.map((table) => table.target),
            // entities: ['dist/src/**/*.entity.js', 'dist/src/**/*.entity.enum.js'],
            synchronize: true,
          });
    
          try {
            if (!dataSource.isInitialized) {
              await dataSource.initialize();
            }
          } catch (error) {
            console.error(error?.message);
          }
    
          return dataSource;
        },
    },
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
        provide: 'EventBus',
        useFactory: (eventPublisher: IEventPublisher, notifier: INotifier, logger: ILogger) => {
            const eventBus = new EventPublisherLoggerDecorator(eventPublisher, logger);

            //aqui subscribimos a todos los que escuchan los eventos
            eventBus.subscribe('SubscriptionExpired', [new NotifySubscriptionExpiredEvent(notifier)]);
            eventBus.subscribe('SubscriptionCreated', [new NotifySubscriptionCreatedEvent(notifier)]);

            return eventBus;
    },
        inject: ['IEventPublisher', 'INotifier', 'ILogger'],
    },
    
]