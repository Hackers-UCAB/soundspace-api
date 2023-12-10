import {
  Controller,
  Post,
  Body,
  Inject
} from '@nestjs/common';
import { AuthInfraestructureDto } from '../dto/auth.infraestructure.dto';
import { SignUpApplicationService } from 'src/auth/application/services/sign-up-service.application.service';
import { UserRepository } from 'src/user/infraestructure/repositories/user.repository';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller('auth')
export class AuthController {

  constructor(
    @Inject('DataSource')
    private readonly dataSource: DataSource
  ){}

  @Post()
  async signUp(@Body() authDto: AuthInfraestructureDto) {
    const service = new SignUpApplicationService(new UserRepository(this.dataSource));

    return await service.execute(authDto);
  }
}
