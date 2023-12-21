import { Logger, Provider } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
import { LoggerApplicationServiceDecorator } from 'src/common/application/services/decorators/logger-decorator/logger-application-service.service.decorator';
import { AuditingCommandServiceDecorator } from 'src/common/application/services/decorators/auditing-decorator/auditing-application-service.decorator';
import { LoginApplicationService } from 'src/auth/application/services/log-in-service.application.service';
import { AuditingRepository } from '../../repositories/auditing.repository';
import { LoggerImpl } from '../../logger/logger';
import { ILogger } from 'src/common/application/logging-handler/logger.interface';
import { IJwtGenerator } from 'src/auth/application/interface/jwt-generator.interface';

export const servicesProvidersManager: Provider[] = [
  {
    provide: 'MovistarSignUpApplicationService',
    useFactory: (jwtGenerator: IJwtGenerator, dataSource: DataSource, eventBus: EventBus, logger: ILogger ) => {
      return new LoggerApplicationServiceDecorator(
        new AuditingCommandServiceDecorator(
          new SignUpMovistarApplicationService(
            new UserRepository(dataSource),
            new SubscriptionRepository(dataSource),
            new UuidGenerator(),
            new MovistarSubscriptionValidation(),
            jwtGenerator,
            eventBus
          ),
          new AuditingRepository(dataSource),
          'Movistar Sign-Up',
          logger,
        ),
        logger,
        'Movistar Sign-Up',
      );
    },
    inject: [ 'IJwtGenerator', 'DataSource', 'EventBus', 'ILogger'],
  },
  {
    provide: 'DigitelSignUpApplicationService',
    useFactory: (jwtGenerator: IJwtGenerator, dataSource: DataSource, eventBus: EventBus, logger: ILogger ) => {
      return new LoggerApplicationServiceDecorator(
        new AuditingCommandServiceDecorator(
          new SignUpDigitelApplicationService(
            new UserRepository(dataSource),
            new SubscriptionRepository(dataSource),
            new UuidGenerator(),
            new DigitelSubscriptionValidation(),
            jwtGenerator,
            eventBus
          ),
          new AuditingRepository(dataSource),
          'Digitel Sign-Up',
          logger
        ),
        logger,
        'Digitel Sign-Up',
      );
    },
    inject: ['IJwtGenerator','DataSource', 'EventBus', 'ILogger'],
  },
  {
    provide: 'LoginApplicationService',
    useFactory: (jwtGenerator: IJwtGenerator, dataSource: DataSource, logger: ILogger ) => {
      return new LoggerApplicationServiceDecorator(
        new AuditingCommandServiceDecorator(
          new LoginApplicationService(
            new SubscriptionRepository(dataSource),
            new UserRepository(dataSource),
            jwtGenerator
          ),
          new AuditingRepository(dataSource),
          'Log-In',
          logger,
        ),
        logger,
        'Log-In',
      )
    },
    inject: ['IJwtGenerator', 'DataSource', 'ILogger'],
  }
];