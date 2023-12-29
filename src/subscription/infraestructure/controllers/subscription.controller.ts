import { Controller, Get, Inject, Post } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IEventPublisher } from 'src/common/application/events/event-publisher.interface';
import { CheckExpiredSubscriptionsApplicationService } from 'src/subscription/application/services/check-expired-subscriptions.application.service';


@Controller('subscription')
export class SubscriptionController {
  constructor(
    @Inject('DataSource') private readonly dataSource: DataSource,
    @Inject('EventBus') private eventBus: IEventPublisher,  
  ) {}

  @Get('check-subscriptions')
  async checkSubscriptions() {
    console.log(new Date());


    
  
    return 'funciono';
  };

}
