
import { Type } from 'class-transformer';
import { IsIn, IsOptional } from 'class-validator';

export class QuerySearchDto {

    @IsOptional()
    @Type(() => String)
    @IsIn(['album', 'playlist', 'song', 'artist'])
    type?: string
}

// export class QuerySearchDto {

//     @IsOptional()
//     @Type(() => String)
//     @IsArray()
//     @IsIn(['album', 'playlist', 'song', 'artist'])
//     types?: string[]
// }