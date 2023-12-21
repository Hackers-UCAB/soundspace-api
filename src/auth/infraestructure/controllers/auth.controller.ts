import { Controller, Post, Body, Inject, Get, Headers } from '@nestjs/common';
import { AuthInfraestructureDto } from '../dto/entrys/auth.infraestructure.dto';
import { DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { LoginApplicationService } from 'src/auth/application/services/log-in-service.application.service';
import { SignUpInfraestructureDto } from '../dto/entrys/sign-up.infraestructure.dto';
import { SubscriptionRepository } from 'src/subscription/infraestructure/repositories/subscription.repository';
import { JwtGenerator } from '../jwt-generator';
import { Result } from 'src/common/application/result-handler/result';
import { AuthHeaderInfraestructureDto } from '../dto/entrys/auth-header.infraestructure.dto';
import { SignUpApplicationDto } from 'src/auth/application/dto/entrys/sign-up.application.dto';
import { IEventPublisher } from 'src/common/application/events/event-publisher.interface';
import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { LoggerApplicationServiceDecorator } from 'src/common/application/services/decorators/logger-decorator/logger-application-service.service.decorator';
import { LoggerImpl } from 'src/common/infraestructure/logger/logger';
import { AuditingRepository } from 'src/common/infraestructure/repositories/auditing.repository';
import { LogInInfraestructureDto } from '../dto/entrys/log-in.infraestructure.dto';
import { LogInApplicationDto } from 'src/auth/application/dto/entrys/log-in.application.dto';
import { AuditingCommandServiceDecorator } from 'src/common/application/services/decorators/auditing-decorator/auditing-application-service.decorator';
import { SignUpResponseApplicationDto } from 'src/auth/application/dto/responses/sign-up-response.application.dto';
import { LogInResponseApplicationDto } from 'src/auth/application/dto/responses/log-in-response.application.dto';
import { IJwtGenerator } from 'src/auth/application/interface/jwt-generator.interface';
import { SignUpResponseInfraestructureDto } from '../dto/responses/sign-up-response.infraestructure.dto';
import { HttpResponseHandler } from 'src/common/infraestructure/http-response-handler/http-response.handler';
import { LogInResponseInfraestructureDto } from '../dto/responses/log-in-response.infraestructure.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('DataSource')
    private readonly dataSource: DataSource,

    @Inject('MovistarSignUpApplicationService')
    private readonly signUpMovistarApplicationService: IApplicationService<
      SignUpApplicationDto,
      SignUpResponseApplicationDto
    >,

    @Inject('DigitelSignUpApplicationService')
    private readonly signUpDigitelApplicationService: IApplicationService<
      SignUpApplicationDto,
      SignUpResponseApplicationDto
    >,

    @Inject('LoginApplicationService')
    private readonly loginApplicationService: IApplicationService<
      LogInApplicationDto,
      LogInResponseApplicationDto
    >,
  ) {}

  @Post('sign-up/movistar')
  async signUpMovistar(
    @Body() signUpDto: SignUpInfraestructureDto,
    @Headers() headers: AuthHeaderInfraestructureDto,
  ) {
    if (!headers.token) {
      return Result.fail(
        null,
        404,
        'No se ha proporcionado un token de firebase',
        new Error('No se ha proporcionado un token de firebase'),
      );
    }
    const dto: SignUpApplicationDto = {
      ...signUpDto,
      token: headers.token,
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
    @Body() signUpDto: SignUpInfraestructureDto,
    @Headers() headers: AuthHeaderInfraestructureDto,
  ) {
    if (!headers.token) {
      return Result.fail(
        null,
        404,
        'No se ha proporcionado un token de firebase',
        new Error('No se ha proporcionado un token de firebase'),
      );
    }
    const dto: SignUpApplicationDto = {
      ...signUpDto,
      token: headers.token,
    };
    const serviceResult: Result<SignUpResponseApplicationDto> = await this.signUpDigitelApplicationService.execute(dto);

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
    @Body() logIn: LogInInfraestructureDto,
    @Headers() headers: AuthHeaderInfraestructureDto,
  ) {
    if (!headers.token) {
      return Result.fail(
        null,
        404,
        'No se ha proporcionado un token de firebase',
        new Error('No se ha proporcionado un token de firebase'),
      );
    }
    const dto: LogInApplicationDto = {
      ...logIn,
      token: headers.token,
    };

    const serviceResult: Result<LogInResponseApplicationDto> = await this.loginApplicationService.execute(dto);
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
