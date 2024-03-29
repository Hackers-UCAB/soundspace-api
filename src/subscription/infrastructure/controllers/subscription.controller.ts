import { Controller, Get, Inject, Post } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IEventPublisher } from 'src/common/application/events/event-publisher.interface';
import { ApiBearerAuth, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Auth } from 'src/auth/infrastructure/jwt/decorators/auth.decorator';
import { GetUser } from 'src/auth/infrastructure/jwt/decorators/get-user.decorator';
import { UserId } from 'src/user/domain/value-objects/user-id';
import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { ServiceEntry } from 'src/common/application/services/dto/entry/service-entry.dto';
import { ServiceResponse } from 'src/common/application/services/dto/response/service-response.dto';
import { Result } from 'src/common/domain/result-handler/result';
import { HttpResponseHandler } from 'src/common/infrastructure/http-response-handler/http-response.handler';

@ApiTags('Subscription')
@ApiBearerAuth('token')
@ApiUnauthorizedResponse({ description: 'No se encontro el token' })
@Controller('subscription')
export class SubscriptionController {
  constructor(
    @Inject('CancelSubscriptionService')
    private readonly cancelSubscriptionService: IApplicationService<
      ServiceEntry,
      ServiceResponse
    >,
  ) {}

  @Get('check-subscriptions')
  async checkSubscriptions() {
    console.log(new Date());

    return 'funciono';
  }

  @Post('cancel')
  @Auth()
  async cancelSubscription(@GetUser('id') userId: UserId) {
    const dto: ServiceEntry = {
      userId: userId.Id,
    };

    const serviceResult: Result<ServiceResponse> =
      await this.cancelSubscriptionService.execute(dto);

    if (!serviceResult.IsSuccess) {
      return HttpResponseHandler.HandleException(
        serviceResult.StatusCode,
        serviceResult.message,
        serviceResult.error,
      );
    }
    return HttpResponseHandler.Success(200, 'Se cancelo la suscripcion');
  }
}
