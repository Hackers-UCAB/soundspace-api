import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class LogInEntryInfraestructureDto {
  
  @ApiProperty({ type: String, example: '4123684719', description: "Numero registrado para logearse"})
  @IsString()
  @MinLength(10)
  @MaxLength(10)
  phone: string;
}
