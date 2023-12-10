import { Controller, Get, Inject, Param, ParseUUIDPipe } from '@nestjs/common';
import { FindSubscriptionService } from 'src/subscription/application/services/find-subscription-service.application.service';
import { DataSource } from 'typeorm';
import { SubscriptionRepository } from '../repositories/subscription.repository';
import { ErrorHandlerApplicationServiceDecorator } from 'src/common/application/services/decorators/error-handler-decorator/error-handler-application-service.decorator';

@Controller('subscription')
export class SubscriptionController {
  constructor(
    @Inject('DataSource')
    private readonly dataSource: DataSource,
  ) {}

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const service = new ErrorHandlerApplicationServiceDecorator(
      new FindSubscriptionService(new SubscriptionRepository(this.dataSource)),
    );

    //new FindSubscriptionService(new SubscriptionRepository(this.dataSource));

    return await service.execute(id);
  }
}
