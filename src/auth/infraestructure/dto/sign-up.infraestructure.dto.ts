import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { AuthApplicationDto } from 'src/auth/application/dto/auth.application.dto';
import { SignUpApplicationDto } from 'src/auth/application/dto/sign-up.application.dto';

export class SignUpInfraestructureDto {
  
  @IsString()
  @MinLength(10)
  @MaxLength(10)
  phone: string;

}
