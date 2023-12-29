import { Controller, Get, Inject, Post } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IEventPublisher } from 'src/common/application/events/event-publisher.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Subscription')
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
