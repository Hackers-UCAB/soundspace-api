import { Controller, Get, Inject } from '@nestjs/common';
import { Auth } from 'src/auth/infrastructure/jwt/decorators/auth.decorator';
import { GetUser } from 'src/auth/infrastructure/jwt/decorators/get-user.decorator';
import { Result } from 'src/common/domain/result-handler/result';
import { ServiceEntry } from 'src/common/application/services/dto/entry/service-entry.dto';
import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { HttpResponseHandler } from 'src/common/infrastructure/http-response-handler/http-response.handler';
import { GetRandomPromotionResponseApplicationDto } from 'src/promotions/application/dto/response/get-random-promotion-response.application.dto';
import { GetRandomPromotionResponseInfrastructureDto } from '../dto/response/get-random-promotion-response.infraestructure.dto';
import { UserId } from 'src/user/domain/value-objects/user-id';
import { IGetBufferImageInterface } from 'src/common/domain/interfaces/get-buffer-image.interface';
import { ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('Promotion')
@ApiBearerAuth('token')
@ApiUnauthorizedResponse({ description: 'No se encontro el token' })
@Controller('promotion')
export class PromotionController {
  constructor(
    @Inject('AzureBufferImageHelper')
    private readonly getBufferImageHelper: IGetBufferImageInterface,
    
    @Inject('GetRandomPromotionApplicationService')
    private readonly getRandomPromotionApplicationService: IApplicationService<
      ServiceEntry,
      GetRandomPromotionResponseApplicationDto
    >,
  ) {}

  @Get()
  @ApiOkResponse({ description: 'Devuelve una promocion',type: GetRandomPromotionResponseInfrastructureDto })
  @Auth()
  async getRandomPromotion(@GetUser('id') userId: UserId) {
    const dto: ServiceEntry = {
      userId: userId.Id,
    }
    const serviceResult: Result<GetRandomPromotionResponseApplicationDto> =
      await this.getRandomPromotionApplicationService.execute(dto);

    if (!serviceResult.IsSuccess) {
      HttpResponseHandler.HandleException(
        serviceResult.statusCode,
        serviceResult.message,
        serviceResult.error,
      );
    }

    const promotionImage = await this.getBufferImageHelper.getFile(
      serviceResult.Data.promotion.ImageRef.Path
    );
    
    const response: GetRandomPromotionResponseInfrastructureDto = {
        id: serviceResult.Data.promotion.Id.Id,
        url: serviceResult.Data.promotion.Url.Path,
        image: promotionImage.IsSuccess ? promotionImage.Data : null,
    }
    return HttpResponseHandler.Success(200, response);
  }
}
