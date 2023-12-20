import { Controller, Post, Body, Inject, Get, Headers } from '@nestjs/common';
import { AuthInfraestructureDto } from '../dto/auth.infraestructure.dto';
import { DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { LoginApplicationService } from 'src/auth/application/services/log-in-service.application.service';
import { SignUpInfraestructureDto } from '../dto/sign-up.infraestructure.dto';
import { SubscriptionRepository } from 'src/subscription/infraestructure/repositories/subscription.repository';
import { JwtGenerator } from '../jwt-generator';
import { Result } from 'src/common/application/result-handler/result';
import { ErrorHandlerApplicationServiceDecorator } from 'src/common/application/services/decorators/error-handler-decorator/error-handler-application-service.decorator';
import { AuthHeaderInfraestructureDto } from '../dto/auth-header.infraestructure.dto';
import { SignUpApplicationDto } from 'src/auth/application/dto/sign-up.application.dto';
import { IEventPublisher } from 'src/common/application/events/event-publisher.interface';
import { IApplicationService } from 'src/common/application/services/interfaces/application-service.interface';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(JwtService) 
    private readonly jwtService: JwtService,

    @Inject('DataSource')
    private readonly dataSource: DataSource,

    @Inject('MovistarSignUpApplicationService')
    private readonly signUpMovistarApplicationService: IApplicationService<SignUpApplicationDto, string>,

    @Inject('DigitelSignUpApplicationService')
    private readonly signUpDigitelApplicationService: IApplicationService<SignUpApplicationDto, string>,
    
    @Inject('EventBus')
    private readonly eventBus: IEventPublisher,
  ) {}

  @Post('sign-up/movistar')
  async signUpMovistar(@Body() signUpDto: SignUpInfraestructureDto, @Headers() headers: AuthHeaderInfraestructureDto) {
   
    if(!headers.token){
      return Result.fail(null,404,'No se ha proporcionado un token de firebase', new Error('No se ha proporcionado un token de firebase'));
    }
    const dto:SignUpApplicationDto = {
      ... signUpDto,
      token: headers.token
    }
    return await this.signUpMovistarApplicationService.execute(dto);
  }

  @Post('sign-up/digitel')
  async signUpDigitel(@Body() signUpDto: SignUpInfraestructureDto, @Headers() headers: AuthHeaderInfraestructureDto) {
   
    if(!headers.token){
      return Result.fail(null,404,'No se ha proporcionado un token de firebase', new Error('No se ha proporcionado un token de firebase'));
    }
    const dto:SignUpApplicationDto = {
      ... signUpDto,
      token: headers.token
    }
    return await this.signUpDigitelApplicationService.execute(dto);
  }

  @Get()
  async login(@Body() authDto: AuthInfraestructureDto) {
    const service = new LoginApplicationService(
      new SubscriptionRepository(this.dataSource),
      new JwtGenerator(this.jwtService),
    );
    const result = await service.execute(authDto);
    return result;
  }
}
