import { IsString, MaxLength, MinLength } from 'class-validator';
import { AuthApplicationDto } from 'src/auth/application/dto/auth.application.dto';
import { LogInApplicationDto } from 'src/auth/application/dto/log-in.application.dto';

export class LogInInfraestructureDto {
  
  @IsString()
  @MinLength(10)
  @MaxLength(10)
  phone: string;
}
