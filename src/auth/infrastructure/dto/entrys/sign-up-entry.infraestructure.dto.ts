import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class SignUpEntryInfraestructureDto {
  
  @ApiProperty({type: String, description: 'El telefono a suscribir, tiene que ser movistar o digitel', minLength: 10, maxLength: 10, example: '4123684719'} )
  @IsString()
  @MinLength(10)
  @MaxLength(10)
  phone: string;

}
