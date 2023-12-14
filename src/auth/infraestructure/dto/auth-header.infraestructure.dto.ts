import { Type } from "class-transformer";
import { IsOptional, IsPositive, IsString, IsUUID, Min, MinLength } from "class-validator";

export class AuthHeaderInfraestructureDto {
    @IsString()
    firebasetoken:string;
}