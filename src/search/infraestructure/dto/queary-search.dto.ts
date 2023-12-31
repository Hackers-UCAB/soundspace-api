
import { Type } from 'class-transformer';
import { IsIn, IsOptional } from 'class-validator';

export class QuerySearchDto {

    @IsOptional()
    @Type(() => String)
    @IsIn(['album', 'song'])
    type?: string
}