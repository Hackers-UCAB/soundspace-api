import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsIn, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class QuerySearchDto {
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsIn(['albums', 'playlists', 'songs', 'artists'], { each: true })
  type?: string[];

  @IsOptional()
  @IsPositive()
  @Min(1)
  limit?: number;

  @IsOptional()
  @Min(0)
  offset?: number;
}
