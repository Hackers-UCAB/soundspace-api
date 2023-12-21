import { Controller, Post, Body, Inject, Get, Headers } from '@nestjs/common';
import { AuthInfraestructureDto } from '../dto/auth.infraestructure.dto';
import { DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { LoginApplicationService } from 'src/auth/application/services/log-in-service.application.service';
import { SignUpInfraestructureDto } from '../dto/sign-up.infraestructure.dto';
import { SubscriptionRepository } from 'src/subscription/infraestructure/repositories/subscription.repository';
import { JwtGenerator } from '../jwt-generator';
import { Result } from 'src/common/application/result-handler/result';
import { AuthHeaderInfraestructureDto } from '../dto/auth-header.infraestructure.dto';
import { SignUpApplicationDto } from 'src/auth/application/dto/sign-up.application.dto';
import { IEventPublisher } from 'src/common/application/events/event-publisher.interface';
import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';
import { LoggerApplicationServiceDecorator } from 'src/common/application/services/decorators/logger-decorator/logger-application-service.service.decorator';
import { LoggerImpl } from 'src/common/infraestructure/logger/logger';
import { AuditingRepository } from 'src/common/infraestructure/repositories/auditing.repository';
import { LogInInfraestructureDto } from '../dto/log-in.infraestructure.dto';
import { LogInApplicationDto } from 'src/auth/application/dto/log-in.application.dto';
import { AuditingCommandServiceDecorator } from 'src/common/application/services/decorators/auditing-decorator/auditing-application-service.decorator';
import { SignUpResponseApplicationDto } from 'src/auth/application/dto/responses/sign-up-response.application.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(JwtService)
    private readonly jwtService: JwtService,

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

    @Inject('EventBus')
    private readonly eventBus: IEventPublisher,
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
    return await this.signUpMovistarApplicationService.execute(dto);
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
    return await this.signUpDigitelApplicationService.execute(dto);
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

    const service = new LoggerApplicationServiceDecorator(
      new AuditingCommandServiceDecorator(
        new LoginApplicationService(
          new SubscriptionRepository(this.dataSource),
          new JwtGenerator(this.jwtService),
        ),
        new AuditingRepository(this.dataSource),
        'Log-In',
        new LoggerImpl(),
      ),
      new LoggerImpl(),
      'Log-In',
    );

    const result = await service.execute(dto);
    return result;
  }
}
