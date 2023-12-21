import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { AuthApplicationDto } from 'src/auth/application/dto/entrys/auth.application.dto';
import { SignUpApplicationDto } from 'src/auth/application/dto/entrys/sign-up.application.dto';

export class SignUpInfraestructureDto {
  
  @IsString()
  @MinLength(10)
  @MaxLength(10)
  phone: string;

}
