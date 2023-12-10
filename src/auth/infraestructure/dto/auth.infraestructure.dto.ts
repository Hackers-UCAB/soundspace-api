import { IsString, MaxLength, MinLength } from 'class-validator';
import { AuthApplicationDto } from 'src/auth/application/dto/auth.application.dto';

export class AuthInfraestructureDto implements AuthApplicationDto {
  @IsString()
  @MinLength(10)
  @MaxLength(12)
  phoneNumber: string;
}
