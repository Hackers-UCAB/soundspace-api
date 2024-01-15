import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive, IsString, IsUUID, Min, MinLength } from "class-validator";

export class AuthHeaderInfraestructureDto {
    @ApiProperty({type: String, description: 'Token de Firebase'})
    @IsString()
    token:string;
}