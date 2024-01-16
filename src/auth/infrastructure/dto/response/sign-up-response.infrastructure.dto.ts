import { ApiProperty } from "@nestjs/swagger";

export class SignUpResponseInfrastructureDto{
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE5NGY4MTc2LTY5MjktNDY5NC05NDhjLTU0OGI5OTgxNGMxMSIsImlhdCI6MTcwMzgxMTkzNSwiZXhwIjoxNzAzODk4MzM1fQ.5CGxA0UEZ0r9GaJWLM5c0QEYeK9LLETYXvW22loFBl4', description: 'JWT Token de autenticacion'})
    token: string;
}

export class SignUpSwaggerResponseInfrastructureDto{
    @ApiProperty()
    data: SignUpResponseInfrastructureDto
    @ApiProperty({ default:201, description: 'Status Code'})
    statusCode: number
}

