import {
  Body,
  Controller,
  Get,
  Inject,
  Patch,
  Post,
} from '@nestjs/common';
import { Auth } from 'src/auth/infrastructure/jwt/decorators/auth.decorator';
import { GetUser } from 'src/auth/infrastructure/jwt/decorators/get-user.decorator';
import { Result } from 'src/common/domain/result-handler/result';
import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { HttpResponseHandler } from 'src/common/infrastructure/http-response-handler/http-response.handler';
import { GetUserInfoResponseApplicationDto } from 'src/user/application/dto/response/get-user-info-response.application.dto';

import { UserId } from 'src/user/domain/value-objects/user-id';
import { GetUserInfoResponseInfrastructureDto, GetUserInfoSwaggerResponseInfrastructureDto } from '../dto/response/get-user-info-response.infraestructure.dto';
import { UpdateUserInfoEntryInfrastructureDto } from '../dto/entry/update-user-info.entry.infraestructure.dto';
import { UpdateUserInfoEntryApplicationDto } from 'src/user/application/dto/entry/update-user-info-entry.application.dto';
import { UpdateUserInfoResponseApplicationDto } from 'src/user/application/dto/response/update-user-info-response.application.dto';
import { ServiceEntry } from 'src/common/application/services/dto/entry/service-entry.dto';
import { ApiBearerAuth, ApiOkResponse, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../odm-entities/user.entity';
import { Model } from 'mongoose';

@ApiTags('User')
@Controller('user')
@ApiBearerAuth('token')
@ApiUnauthorizedResponse({ description: 'No se encontro el token' })
export class UserController {
  constructor(
    @Inject('GetUserInfoApplicationService')
    private readonly getUserInfoApplicationService: IApplicationService<
      ServiceEntry,
      GetUserInfoResponseApplicationDto
    >,

    @Inject('UpdateUserInfoApplicationService')
    private readonly updateUserInfoApplicationService: IApplicationService<
      UpdateUserInfoEntryApplicationDto,
      UpdateUserInfoResponseApplicationDto
    >,

    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  @Get()
  @Auth()
  @ApiResponse({ status: 200, description: 'Se recibio correctamente la info del usuario', type: GetUserInfoSwaggerResponseInfrastructureDto })
  async getUser(@GetUser('id') userId: UserId) {
    const serviceResult: Result<GetUserInfoResponseApplicationDto> =
      await this.getUserInfoApplicationService.execute({userId: userId.Id});
    if (!serviceResult.IsSuccess) {
      HttpResponseHandler.HandleException(
        serviceResult.StatusCode,
        serviceResult.message,
        serviceResult.error,
      );
    }
    const response: GetUserInfoResponseInfrastructureDto = {
      id: serviceResult.Data.userId,
      name: serviceResult.Data.user?.Name?.Name,
      email: serviceResult.Data.user?.Email?.Email,
      birthdate: serviceResult.Data.user?.Birthday?.Birthday,
      gender: serviceResult.Data.user?.Gender?.Gender,
    };
    return HttpResponseHandler.Success(200, response);
  }

  @Patch()
  @Auth()
  @ApiOkResponse({ description: 'Se actualizo correctamente la info del usuario, devuelve true'})
  async updateUser(
    @Body() updateUserDto: UpdateUserInfoEntryInfrastructureDto,
    @GetUser('id') userId: UserId,
  ) {
    const dto: UpdateUserInfoEntryApplicationDto = {
      ...updateUserDto,
      userId: userId.Id,
    };
    
    const serviceResult: Result<UpdateUserInfoResponseApplicationDto> =
      await this.updateUserInfoApplicationService.execute(dto);

    if (!serviceResult.IsSuccess) {
      HttpResponseHandler.HandleException(
        serviceResult.StatusCode,
        serviceResult.message,
        serviceResult.error,
      );
    }
    return HttpResponseHandler.Success(200, serviceResult.Data.message);
  }

  @Post('prueba')
  async prueba() {
    const user = await this.userModel.create({
      name: 'prueba'
    });
    return HttpResponseHandler.Success(200, user);
  }

}

