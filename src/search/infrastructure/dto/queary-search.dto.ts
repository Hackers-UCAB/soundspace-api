import { Type } from 'class-transformer';
import { IsIn, IsOptional, IsPositive, Min } from 'class-validator';

export class QuerySearchDto {
  @IsOptional()
  @Type(() => String)
  @IsIn(['albums', 'playlists', 'songs', 'artists'])
  type?: string;

  @IsOptional()
  @IsPositive()
  @Min(1)
  limit?: number;

  @IsOptional()
  @Min(0)
  offset?: number;
}
