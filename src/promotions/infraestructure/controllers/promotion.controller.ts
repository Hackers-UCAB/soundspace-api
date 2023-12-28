import { Controller, Get, Inject } from '@nestjs/common';
import { Auth } from 'src/auth/infraestructure/jwt/decorators/auth.decorator';
import { GetUser } from 'src/auth/infraestructure/jwt/decorators/get-user.decorator';
import { Result } from 'src/common/application/result-handler/result';
import { ServiceEntry } from 'src/common/application/services/dto/entry/service-entry.dto';
import { ServiceResponse } from 'src/common/application/services/dto/response/service-response.dto';
import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { HttpResponseHandler } from 'src/common/infraestructure/http-response-handler/http-response.handler';
import { GetRandomPromotionResponseApplicationDto } from 'src/promotions/application/dto/responses/get-random-promotion-response.application.dto';
import { GetRandomPromotionResponseInfraestructureDto } from '../dto/responses/get-random-promotion-response.infraestructure.dto';
import { UserId } from 'src/user/domain/value-objects/user-id';

@Controller('promotion')
export class PromotionController {
  constructor(
    @Inject('GetRandomPromotionApplicationService')
    private readonly getRandomPromotionApplicationService: IApplicationService<
      ServiceEntry,
      GetRandomPromotionResponseApplicationDto
    >,
  ) {}

  @Get()
  @Auth()
  async getRandomPromotion(@GetUser('id') userId: UserId) {
    const serviceResult: Result<GetRandomPromotionResponseApplicationDto> =
      await this.getRandomPromotionApplicationService.execute({
        userId: userId.Id,
      });
    if (!serviceResult.IsSuccess) {
      HttpResponseHandler.HandleException(
        serviceResult.statusCode,
        serviceResult.message,
        serviceResult.error,
      );
    }
    const response: GetRandomPromotionResponseInfraestructureDto = {
        id: serviceResult.Data.promotion.Id.Id,
        url: serviceResult.Data.promotion.Url.Path,
        image: serviceResult.Data.image
    }
    return HttpResponseHandler.Success(200, response);
  }
}
