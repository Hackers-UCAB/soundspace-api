import { ApiProperty } from "@nestjs/swagger";

export class GetUserInfoResponseInfraestructureDto {
  @ApiProperty({
    example: '51fa551a-3f47-4ccb-9b88-71ed6eb5f51b',
  })
  id: string;

  @ApiProperty({
    example: 'Carlos',
    nullable: true
  })
  name?: string;

  @ApiProperty({
    example: 'carlosalonso@gmail.com',
    nullable: true
  })
  email?: string;

  @ApiProperty({
    example: '2000-01-01',
    nullable: true
  })
  birthdate?: Date;
  
  @ApiProperty({
    example: 'Male',
    nullable: true,
  })
  gender?: string;
  
}

export class GetUserInfoSwaggerResponseInfraestructureDto{
  @ApiProperty()
  data: GetUserInfoResponseInfraestructureDto
  
  @ApiProperty({
    example: 200
  })
  statusCode: number
}
