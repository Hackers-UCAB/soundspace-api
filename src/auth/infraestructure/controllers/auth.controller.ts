import {Controller, Post, Body, Inject, Get} from "@nestjs/common";
import { AuthInfraestructureDto } from '../dto/auth.infraestructure.dto';
import { SignUpApplicationService } from 'src/auth/application/services/sign-up-service.application.service';
import { UserRepository } from 'src/user/infraestructure/repositories/user.repository';
import { DataSource } from 'typeorm';
import { LoginApplicationService } from "src/auth/application/services/log-in-service.application.service";
import { OrmUserMapper } from "src/user/infraestructure/mapper/orm-user.mapper";
import { OrmUserEntity } from "src/user/infraestructure/orm-entities/user.entity";

@Controller('auth')
export class AuthController {

  constructor(
    @Inject('DataSource')
    private readonly dataSource: DataSource,
    private readonly userMapper: OrmUserMapper 
  ){}

  @Post()
  async signUp(@Body() authDto: AuthInfraestructureDto) {
    const service = new SignUpApplicationService(new UserRepository(this.dataSource));

    return await service.execute(authDto);
  }

  @Get()
  async login(@Body() authDto: AuthInfraestructureDto): Promise<OrmUserEntity> {
    const service = new LoginApplicationService(new UserRepository(this.dataSource));

    const result = await service.execute(authDto);

    return this.userMapper.toPersistence(result.data);
    
  }
}
