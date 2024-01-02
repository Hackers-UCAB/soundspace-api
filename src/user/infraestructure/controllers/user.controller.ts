import {
  Body,
  Controller,
  Get,
  Inject,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { Auth } from 'src/auth/infraestructure/jwt/decorators/auth.decorator';
import { GetUser } from 'src/auth/infraestructure/jwt/decorators/get-user.decorator';
import { Result } from 'src/common/application/result-handler/result';
import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { ServiceResponse } from 'src/common/application/services/dto/response/service-response.dto';
import { HttpResponseHandler } from 'src/common/infraestructure/http-response-handler/http-response.handler';
import { GetUserInfoResponseApplicationDto } from 'src/user/application/dto/responses/get-user-info-response.application.dto';

import { UserId } from 'src/user/domain/value-objects/user-id';
import { GetUserInfoResponseInfraestructureDto, GetUserInfoSwaggerResponseInfraestructureDto } from '../dto/responses/get-user-info-response.infraestructure.dto';
import { UpdateUserInfoEntryInfraestructureDto } from '../dto/entrys/update-user-info.entry.infraestructure.dto';
import { UpdateUserInfoEntryApplicationDto } from 'src/user/application/dto/entrys/update-user-info-entry.application.dto';
import { UserRole } from 'src/user/domain/value-objects/user-role';
import { UpdateUserInfoResponseApplicationDto } from 'src/user/application/dto/responses/update-user-info-response.application.dto';
import { UserRoleEnum } from 'src/user/domain/value-objects/enum/user-role.enum';
import { User } from 'src/user/domain/user';
import { AuthGuard } from '@nestjs/passport';
import { ServiceEntry } from 'src/common/application/services/dto/entry/service-entry.dto';
import { ApiBearerAuth, ApiOkResponse, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

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
  ) {}

  //Prueba para lo del token
  // @Get('test')
  // @Auth(UserRoleEnum.USER)
  // @UseGuards(AuthGuard())
  // async getAll(@GetUser() user: User) {
  //     console.log(user);

  //     return `Si entro en esta monda con el user`;
  // }

  @Get()
  @Auth()
  @ApiResponse({ status: 200, description: 'Se recibio correctamente la info del usuario', type: GetUserInfoSwaggerResponseInfraestructureDto })
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
    const response: GetUserInfoResponseInfraestructureDto = {
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
    @Body() updateUserDto: UpdateUserInfoEntryInfraestructureDto,
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
    return HttpResponseHandler.Success(200, serviceResult.Data.success);
  }
}

