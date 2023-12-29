import { ApiProperty } from "@nestjs/swagger";

export class LogInResponseInfraestructureDto{
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c', description: 'Token de autenticacion' })
    token: string;
}

export class LogInSwaggerResponseInfraestructureDto{
    @ApiProperty()
    data: LogInResponseInfraestructureDto;
    @ApiProperty({ default: 200, description: 'Status code' })
    statusCode: number;
}

