import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { AuthApplicationDto } from 'src/auth/application/dto/auth.application.dto';

export class SignUpInfraestructureDto implements AuthApplicationDto {
  
  @IsString()
  @MinLength(10)
  @MaxLength(12)
  phoneNumber: string;

  @IsUUID()
  chanelId: string;
}
