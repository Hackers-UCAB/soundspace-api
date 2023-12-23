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

@Controller('subscription')
export class SubscriptionController {
  constructor(
    @Inject('DataSource') private readonly dataSource: DataSource,
    @Inject('EventBus') private eventBus: IEventPublisher,  
  ) {}

  @Get('check-subscriptions')
  async checkSubscriptionsEndDate() {
    this.eventBus.publish([
      SubscriptionExpired.create(SubscriptionId.create('123'),
      UserId.create('123'),
      SubscriptionStatus.create(SubscriptionStatusEnum.EXPIRED))
    ]);

    // const service = new CheckSubscriptionsEndDateService(new SubscriptionRepository(this.dataSource), this.eventBus);
    // service.execute({date: new Date()}); //preguntar por el formato de la fecha
  }
}
