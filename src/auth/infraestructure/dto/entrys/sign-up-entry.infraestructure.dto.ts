import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class SignUpEntryInfraestructureDto {
  
  @IsString()
  @MinLength(10)
  @MaxLength(10)
  phone: string;

}
