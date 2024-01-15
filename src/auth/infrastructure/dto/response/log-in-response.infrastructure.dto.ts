import { ApiProperty } from "@nestjs/swagger";

export class LogInResponseInfrastructureDto{
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c', description: 'Token de autenticacion' })
    token: string;
}

export class LogInSwaggerResponseInfrastructureDto{
    @ApiProperty()
    data: LogInResponseInfrastructureDto;
    @ApiProperty({ default: 200, description: 'Status code' })
    statusCode: number;
}

