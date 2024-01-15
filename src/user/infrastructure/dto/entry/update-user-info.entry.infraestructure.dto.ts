import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEmail, IsIn, IsOptional, IsString, MinLength } from "class-validator";


export class UpdateUserInfoEntryInfrastructureDto {
    @ApiProperty({ required: false, minLength: 3, example: 'Daniel' })
    @IsString()
    @IsOptional()
    @MinLength(3)
    name?: string;
    
    @ApiProperty({ required: false, format:'email', example: 'daniel@gmail.com' })
    @IsEmail()
    @IsOptional()
    email?: string;
    
    @ApiProperty({ required: false, format:'date', example: '2010-01-01' })
    @IsDate()
    @IsOptional()
    birthdate?: Date;

    @ApiProperty({ required: false, example: "M", enum: ['M', 'F', 'O'] })
    @IsIn(['M', 'F', 'O'])
    @IsOptional()
    gender?: string;
}