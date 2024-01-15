import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthHeaderInfrastructureDto {
  @ApiProperty({ type: String, description: 'Token de Firebase' })
  @IsString()
  token: string;
}
