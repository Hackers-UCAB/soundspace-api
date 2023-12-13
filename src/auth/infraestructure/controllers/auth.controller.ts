import { Controller, Post, Body, Inject, Get, Headers } from '@nestjs/common';
import { AuthInfraestructureDto } from '../dto/auth.infraestructure.dto';
import { SignUpApplicationService } from 'src/auth/application/services/sign-up-service.application.service';
import { UserRepository } from 'src/user/infraestructure/repositories/user.repository';
import { DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../jwt-payload.interface';
import { LoginApplicationService } from 'src/auth/application/services/log-in-service.application.service';
import { OrmUserMapper } from 'src/user/infraestructure/mapper/orm-user.mapper';
import { OrmUserEntity } from 'src/user/infraestructure/orm-entities/user.entity';
import { SignUpInfraestructureDto } from '../dto/sign-up.infraestructure.dto';
import { SubscriptionRepository } from 'src/subscription/infraestructure/repositories/subscription.repository';
import { SubscriptionChanelRepository } from 'src/subscription/infraestructure/repositories/subscription-chanel.repository';
import { UuidGenerator } from 'src/common/infraestructure/uuid-generator';
import { JwtGenerator } from '../jwt-generator';
import { Result } from 'src/common/application/result-handler/result';
import { ErrorHandlerApplicationServiceDecorator } from 'src/common/application/services/decorators/error-handler-decorator/error-handler-application-service.decorator';
import { SubscriptionValidation } from 'src/subscription/infraestructure/validation/subscription-validation';
import { AuthHeaderInfraestructureDto } from '../dto/auth-header.infraestructure.dto';
import { SignUpApplicationDto } from 'src/auth/application/dto/sign-up.application.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(JwtService)
    private readonly jwtService: JwtService,

    @Inject('DataSource')
    private readonly dataSource: DataSource,
  ) {}

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpInfraestructureDto, @Headers() headers: AuthHeaderInfraestructureDto) {
    const service = new ErrorHandlerApplicationServiceDecorator(
      new SignUpApplicationService(
        new UserRepository(this.dataSource),
        new SubscriptionRepository(this.dataSource),
        new SubscriptionChanelRepository(this.dataSource),
        new UuidGenerator(),
        new SubscriptionValidation(),
        new JwtGenerator(this.jwtService)
      ),
    );
   
    if(!headers.firebasetoken){
      return Result.fail(null,404,'No se ha proporcionado un token de firebase', new Error('No se ha proporcionado un token de firebase'));
    }
    const dto:SignUpApplicationDto = {
      ... signUpDto,
      firebaseToken: headers.firebasetoken
    }
    return await service.execute(dto);
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
