import { Controller, Post, Body, Inject, Get, Headers } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { SignUpEntryInfraestructureDto } from '../dto/entrys/sign-up-entry.infraestructure.dto';
import { Result } from 'src/common/application/result-handler/result';
import { AuthHeaderInfraestructureDto } from '../dto/entrys/auth-header.infraestructure.dto';
import { SignUpEntryApplicationDto } from 'src/auth/application/dto/entrys/sign-up-entry.application.dto';
import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { LogInEntryInfraestructureDto } from '../dto/entrys/log-in-entry.infraestructure.dto';
import { LogInEntryApplicationDto } from 'src/auth/application/dto/entrys/log-in-entry.application.dto';
import { SignUpResponseApplicationDto } from 'src/auth/application/dto/responses/sign-up-response.application.dto';
import { LogInResponseApplicationDto } from 'src/auth/application/dto/responses/log-in-response.application.dto';
import { SignUpResponseInfraestructureDto } from '../dto/responses/sign-up-response.infraestructure.dto';
import { HttpResponseHandler } from 'src/common/infraestructure/http-response-handler/http-response.handler';
import { LogInResponseInfraestructureDto } from '../dto/responses/log-in-response.infraestructure.dto';
import { EmptyDto } from 'src/common/application/dto/empty.dto';
import { ServiceEntry } from 'src/common/application/services/dto/entry/service-entry.dto';

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
  async signUpMovistar(
    @Body() signUpDto: SignUpEntryInfraestructureDto,
    @Headers() headers: AuthHeaderInfraestructureDto,
  ) {
    if (!headers.token) {
      HttpResponseHandler.HandleException(
        404,
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

    const response: SignUpResponseInfraestructureDto = {
      token: serviceResult.Data.token,
    };
    return HttpResponseHandler.Success(201, response);
  }

  @Post('sign-up/digitel')
  async signUpDigitel(
    @Body() signUpDto: SignUpEntryInfraestructureDto,
    @Headers() headers: AuthHeaderInfraestructureDto,
  ) {
    if (!headers.token) {
      HttpResponseHandler.HandleException(
        404,
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
    const response: SignUpResponseInfraestructureDto = {
      token: serviceResult.Data.token,
    };
    return HttpResponseHandler.Success(201, response);
  }

  @Post('log-in')
  async login(
    @Body() logIn: LogInEntryInfraestructureDto,
    @Headers() headers: AuthHeaderInfraestructureDto,
  ) {
    if (!headers.token) {
      HttpResponseHandler.HandleException(
        404,
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
    const response: LogInResponseInfraestructureDto = {
      token: serviceResult.Data.token,
    };
    return HttpResponseHandler.Success(200, response);
  }

  @Post('log-in/guest')
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
    const response: LogInResponseInfraestructureDto = {
      token: serviceResult.Data.token,
    };
    return HttpResponseHandler.Success(200, response);
  }
}
