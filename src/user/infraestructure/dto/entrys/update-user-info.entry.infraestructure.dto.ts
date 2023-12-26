import { IsDate, IsEmail, IsIn, IsOptional, IsString, MinLength } from "class-validator";


export class UpdateUserInfoEntryInfraestructureDto {
    @IsString()
    @IsOptional()
    @MinLength(3)
    name?: string;
    
    @IsEmail()
    @IsOptional()
    email?: string;
    
    @IsDate()
    @IsOptional()
    birthdate?: Date;
    
    @IsIn(['M', 'F', 'O'])
    @IsOptional()
    gender?: string;
}