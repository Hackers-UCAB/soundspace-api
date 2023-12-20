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
import { EventBus } from '../../events/event-bus';
import { SignUpMovistarApplicationService } from 'src/auth/application/services/sign-up-movistar-service.application.service';
import { MovistarSubscriptionValidation } from 'src/subscription/infraestructure/validation/movistar-subscription-validation';
import { SignUpDigitelApplicationService } from 'src/auth/application/services/sign-up-digitel-service.application.service';
import { DigitelSubscriptionValidation } from 'src/subscription/infraestructure/validation/digitel-subscription-validation';

export const servicesProvidersManager: Provider[] = [
  {
    provide: 'SignUpApplicationService',
    useFactory: (jwtService: JwtService, dataSource: DataSource, eventBus: EventBus ) => {
      return new ErrorHandlerApplicationServiceDecorator(
        new SignUpApplicationService(
          new UserRepository(dataSource),
          new SubscriptionRepository(dataSource),
          new SubscriptionChanelRepository(dataSource),
          new UuidGenerator(),
          new SubscriptionValidation(),
          new JwtGenerator(jwtService),
          eventBus
        ),
      );
    },
    inject: [JwtService, 'DataSource', 'EventBus'],
  },
  {
    provide: 'MovistarSignUpApplicationService',
    useFactory: (jwtService: JwtService, dataSource: DataSource, eventBus: EventBus ) => {
      return new ErrorHandlerApplicationServiceDecorator(
        new SignUpMovistarApplicationService(
          new UserRepository(dataSource),
          new SubscriptionRepository(dataSource),
          new UuidGenerator(),
          new MovistarSubscriptionValidation(),
          new JwtGenerator(jwtService),
          eventBus
        ),
      );
    },
    inject: [JwtService, 'DataSource', 'EventBus'],
  },
  {
    provide: 'DigitelSignUpApplicationService',
    useFactory: (jwtService: JwtService, dataSource: DataSource, eventBus: EventBus ) => {
      return new ErrorHandlerApplicationServiceDecorator(
        new SignUpDigitelApplicationService(
          new UserRepository(dataSource),
          new SubscriptionRepository(dataSource),
          new UuidGenerator(),
          new DigitelSubscriptionValidation(),
          new JwtGenerator(jwtService),
          eventBus
        ),
      );
    },
    inject: [JwtService, 'DataSource', 'EventBus'],
  },
];