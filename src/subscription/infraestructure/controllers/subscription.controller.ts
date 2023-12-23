import { Controller, Get, Inject, Post } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { SubscriptionRepository } from '../repositories/subscription.repository';
import { ErrorHandlerApplicationServiceDecorator } from 'src/common/application/services/decorators/error-handler-decorator/error-handler-application-service.decorator';
import { UuidGenerator } from 'src/common/infraestructure/uuid-generator';
import { IEventPublisher } from 'src/common/application/events/event-publisher.interface';
import { SubscriptionExpired } from 'src/subscription/domain/events/subscription-expired.event';
import { SubscriptionId } from 'src/subscription/domain/value-objects/subscription-id';
import { SubscriptionStatus } from 'src/subscription/domain/value-objects/subscription-status';
import { UserId } from 'src/user/domain/value-objects/user-id';
import { SubscriptionStatusEnum } from '../orm-entities/subscription.entity';
import { LoggerApplicationServiceDecorator } from 'src/common/application/services/decorators/logger-decorator/logger-application-service.service.decorator';
import { AuditingCommandServiceDecorator } from 'src/common/application/services/decorators/auditing-decorator/auditing-application-service.decorator';
import { CheckSubscriptionsApplicationService } from 'src/subscription/application/services/check-subscriptions-service.application.service';
import { AuditingRepository } from 'src/common/infraestructure/repositories/auditing.repository';
import { LoggerImpl } from 'src/common/infraestructure/logger/logger';
import { ServiceResponse } from 'src/common/application/services/response/service-response';
import { Result } from 'src/common/application/result-handler/result';

@Controller('subscription')
export class SubscriptionController {
  constructor(
    @Inject('DataSource') private readonly dataSource: DataSource,
    @Inject('EventBus') private eventBus: IEventPublisher,  
  ) {}

  @Get('check-subscriptions')
  async checkSubscriptions() {
    const service = new LoggerApplicationServiceDecorator(
      new AuditingCommandServiceDecorator(
        new CheckSubscriptionsApplicationService(
          new SubscriptionRepository(this.dataSource),
          this.eventBus
        ),
        new AuditingRepository(this.dataSource),
        'Check Subscriptions',
        new LoggerImpl()
      ),
      new LoggerImpl(),
      'Check Subscriptions',
    )

    const checkSubscriptionResult: Result<ServiceResponse> = await service.execute({});
    
    if (!checkSubscriptionResult.IsSuccess) {
      return 'No funciono';
    }

    return 'funciono';
  };

}
