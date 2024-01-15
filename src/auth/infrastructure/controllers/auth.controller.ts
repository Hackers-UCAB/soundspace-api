import { Controller, Post, Body, Inject, Get, Headers } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { SignUpEntryInfrastructureDto } from '../dto/entry/sign-up-entry.infrastructure.dto';
import { Result } from 'src/common/domain/result-handler/result';
import { AuthHeaderInfrastructureDto } from '../dto/entry/auth-header.infrastructure.dto';
import { SignUpEntryApplicationDto } from 'src/auth/application/dto/entry/sign-up-entry.application.dto';
import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { LogInEntryInfrastructureDto } from '../dto/entry/log-in-entry.infrastructure.dto';
import { LogInEntryApplicationDto } from 'src/auth/application/dto/entry/log-in-entry.application.dto';
import { SignUpResponseApplicationDto } from 'src/auth/application/dto/response/sign-up-response.application.dto';
import { LogInResponseApplicationDto } from 'src/auth/application/dto/response/log-in-response.application.dto';
import { SignUpResponseInfrastructureDto, SignUpSwaggerResponseInfrastructureDto } from '../dto/response/sign-up-response.infrastructure.dto';
import { HttpResponseHandler } from 'src/common/infrastructure/http-response-handler/http-response.handler';
import { LogInResponseInfrastructureDto, LogInSwaggerResponseInfrastructureDto } from '../dto/response/log-in-response.infrastructure.dto';
import { ServiceEntry } from 'src/common/application/services/dto/entry/service-entry.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('DataSource')
    private readonly dataSource: DataSource,

    @Inject('MovistarSignUpApplicationService')
    private readonly signUpMovistarApplicationService: IApplicationService<
      SignUpEntryApplicationDto,
      SignUpResponseApplicationDto
    >,

    @Inject('DigitelSignUpApplicationService')
    private readonly signUpDigitelApplicationService: IApplicationService<
      SignUpEntryApplicationDto,
      SignUpResponseApplicationDto
    >,

    @Inject('LogInApplicationService')
    private readonly loginApplicationService: IApplicationService<
      LogInEntryApplicationDto,
      LogInResponseApplicationDto
    >,

    @Inject('LogInGuestApplicationService')
    private readonly logInGuestApplicationService: IApplicationService<
      ServiceEntry,
      LogInResponseApplicationDto
    >,
  ) {}

  @Post('sign-up/movistar')
  @ApiCreatedResponse({ description: 'Se creo correctamente el usuario Movistar', type: SignUpSwaggerResponseInfrastructureDto })
  async signUpMovistar(
    @Body() signUpDto: SignUpEntryInfrastructureDto,
    @Headers() headers: AuthHeaderInfrastructureDto,
  ) {
    if (!headers.token) {
      HttpResponseHandler.HandleException(
        400,
        'No se ha proporcionado un token de firebase',
        new Error('No se ha proporcionado un token de firebase'),
      );
    }
    //Se pone que el usuario que esta realizando esta accion es Unkown porque en este punto no se sabe quien es
    const dto: SignUpEntryApplicationDto = {
      ...signUpDto,
      token: headers.token,
      userId: 'Unkown',
    };
    const serviceResult: Result<SignUpResponseApplicationDto> =
      await this.signUpMovistarApplicationService.execute(dto);

    if (!serviceResult.IsSuccess) {
      HttpResponseHandler.HandleException(
        serviceResult.StatusCode,
        serviceResult.message,
        serviceResult.error,
      );
    }

    const response: SignUpResponseInfrastructureDto = {
      token: serviceResult.Data.token,
    };
    return HttpResponseHandler.Success(201, response);
  }

  @Post('sign-up/digitel')
  @ApiCreatedResponse({ description: 'Se creo correctamente el usuario Digitel', type: SignUpSwaggerResponseInfrastructureDto })
  async signUpDigitel(
    @Body() signUpDto: SignUpEntryInfrastructureDto,
    @Headers() headers: AuthHeaderInfrastructureDto,
  ) {
    if (!headers.token) {
      HttpResponseHandler.HandleException(
        400,
        'No se ha proporcionado un token de firebase',
        new Error('No se ha proporcionado un token de firebase'),
      );
    }
    //Se pone que el usuario que esta realizando esta accion es Unkown porque en este punto no se sabe quien es
    const dto: SignUpEntryApplicationDto = {
      ...signUpDto,
      token: headers.token,
      userId: 'Unkown',
    };
    const serviceResult: Result<SignUpResponseApplicationDto> =
      await this.signUpDigitelApplicationService.execute(dto);

    if (!serviceResult.IsSuccess) {
      HttpResponseHandler.HandleException(
        serviceResult.StatusCode,
        serviceResult.message,
        serviceResult.error,
      );
    }
    const response: SignUpResponseInfrastructureDto = {
      token: serviceResult.Data.token,
    };
    return HttpResponseHandler.Success(201, response);
  }

  @Post('log-in')
  @ApiOkResponse({ type: LogInSwaggerResponseInfrastructureDto })
  async login(
    @Body() logIn: LogInEntryInfrastructureDto,
    @Headers() headers: AuthHeaderInfrastructureDto,
  ) {
    if (!headers.token) {
      HttpResponseHandler.HandleException(
        400,
        'No se ha proporcionado un token de firebase',
        new Error('No se ha proporcionado un token de firebase'),
      );
    }
    //Se pone que el usuario que esta realizando esta accion es Unkown porque en este punto no se sabe quien es
    const dto: LogInEntryApplicationDto = {
      ...logIn,
      token: headers.token,
      userId: 'Unkown',
    };

    const serviceResult: Result<LogInResponseApplicationDto> =
      await this.loginApplicationService.execute(dto);
    if (!serviceResult.IsSuccess) {
      HttpResponseHandler.HandleException(
        serviceResult.StatusCode,
        serviceResult.message,
        serviceResult.error,
      );
    }
    const response: LogInResponseInfrastructureDto = {
      token: serviceResult.Data.token,
    };
    return HttpResponseHandler.Success(200, response);
  }

  @Post('log-in/guest')
  @ApiOkResponse({ type: LogInSwaggerResponseInfrastructureDto, description: 'Se inicio correctamente el usuario invitado' })
  async loginGuest() {
    //Se pone que el usuario que esta realizando esta accion es Unkown porque en este punto no se sabe quien es
    const serviceResult: Result<LogInResponseApplicationDto> =
      await this.logInGuestApplicationService.execute({ userId: 'Unkown' });
    if (!serviceResult.IsSuccess) {
      HttpResponseHandler.HandleException(
        serviceResult.StatusCode,
        serviceResult.message,
        serviceResult.error,
      );
    }
    const response: LogInResponseInfrastructureDto = {
      token: serviceResult.Data.token,
    };
    return HttpResponseHandler.Success(200, response);
  }
}
