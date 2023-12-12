import {Controller, Post, Body, Inject, Get} from "@nestjs/common";
import { AuthInfraestructureDto } from '../dto/auth.infraestructure.dto';
import { SignUpApplicationService } from 'src/auth/application/services/sign-up-service.application.service';
import { UserRepository } from 'src/user/infraestructure/repositories/user.repository';
import { DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../jwt/jwt-payload.interface';
import { LoginApplicationService } from "src/auth/application/services/log-in-service.application.service";
import { OrmUserMapper } from "src/user/infraestructure/mapper/orm-user.mapper";
import { OrmUserEntity } from "src/user/infraestructure/orm-entities/user.entity";
import { SignUpInfraestructureDto } from "../dto/sign-up.infraestructure.dto";
import { SubscriptionRepository } from "src/subscription/infraestructure/repositories/subscription.repository";
import { SubscriptionChanelRepository } from "src/subscription/infraestructure/repositories/subscription-chanel.repository";
import { UuidGenerator } from "src/common/infraestructure/uuid-generator";

@Controller('auth')
export class AuthController {

  constructor(
    @Inject(JwtService)
    private readonly jwtService: JwtService,

    @Inject('DataSource')
    private readonly dataSource: DataSource,
    
    //private readonly userMapper: OrmUserMapper 
  ){}

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpInfraestructureDto) {
    const service = new SignUpApplicationService(
      new UserRepository(this.dataSource), 
      new SubscriptionRepository(this.dataSource),
      new SubscriptionChanelRepository(this.dataSource),
      new UuidGenerator(),
      );

    // const token = this.getJwtToken({id: '1'});

    // console.log(token);
    
    return await service.execute(signUpDto);
  }

  @Get()
  async login(@Body() authDto: AuthInfraestructureDto): Promise<OrmUserEntity> {
    const service = new LoginApplicationService(new UserRepository(this.dataSource));
    const result = await service.execute(authDto);
    return null;
    //return this.userMapper.toPersistence(result.data);
  }
}
