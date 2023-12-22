import { IsString, MaxLength, MinLength } from 'class-validator';

export class LogInEntryInfraestructureDto {
  
  @IsString()
  @MinLength(10)
  @MaxLength(10)
  phone: string;
}
