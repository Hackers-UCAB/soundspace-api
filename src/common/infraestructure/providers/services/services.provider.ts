import { Provider } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignUpApplicationService } from 'src/auth/application/services/sign-up-service.application.service';
import { JwtGenerator } from 'src/auth/infraestructure/jwt-generator';
import { ErrorHandlerApplicationServiceDecorator } from 'src/common/application/services/decorators/error-handler-decorator/error-handler-application-service.decorator';
import { SubscriptionChanelRepository } from 'src/subscription/infraestructure/repositories/subscription-chanel.repository';
import { SubscriptionRepository } from 'src/subscription/infraestructure/repositories/subscription.repository';
import { SubscriptionValidation } from 'src/subscription/infraestructure/validation/subscription-validation';
import { UserRepository } from 'src/user/infraestructure/repositories/user.repository';
import { DataSource } from 'typeorm';
import { UuidGenerator } from '../../uuid-generator';

export const servicesProvidersManager: Provider[] = [
//   {
//     provide: 'IEventPublisher',
//     useClass: EventBus,
//   },
//   {
//     provide: 'INotifier',
//     useClass: FirebaseNotifier,
//   },
//   {
//     provide: 'ILogger',
//     useClass: LoggerImpl,
//   },
//   {
//     provide: 'EventBus',
//     useFactory: (
//       eventPublisher: IEventPublisher,
//       notifier: INotifier,
//       logger: ILogger,
//     ) => {
//       const eventBus = new EventPublisherLoggerDecorator(
//         eventPublisher,
//         logger,
//       );

//       //aqui subscribimos a todos los que escuchan los eventos
//       eventBus.subscribe('SubscriptionExpired', [
//         new NotifySubscriptionExpiredEvent(notifier),
//       ]);
//       eventBus.subscribe('SubscriptionCreated', [
//         new NotifySubscriptionCreatedEvent(notifier),
//       ]);

//       return eventBus;
//     },
//     inject: ['IEventPublisher', 'INotifier', 'ILogger'],
//   },
  {
    provide: 'SignUpApplicationService',
    useFactory: (jwtService: JwtService, dataSource: DataSource) => {
      return new ErrorHandlerApplicationServiceDecorator(
        new SignUpApplicationService(
          new UserRepository(dataSource),
          new SubscriptionRepository(dataSource),
          new SubscriptionChanelRepository(dataSource),
          new UuidGenerator(),
          new SubscriptionValidation(),
          new JwtGenerator(jwtService),
        ),
      );
    },
    inject: [JwtService, 'DataSource'],
  },
];
