import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class AuthDefaultQueries {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    const [key, orderRaw = 'asc'] = (value as string).split(/:(.+)/);
    const order = orderRaw.toLowerCase() === 'desc' ? 'desc' : 'asc';
    return { key, order } as { key: string; order: 'asc' | 'desc' };
  })
  sort?: { key: string; order: 'asc' | 'desc' };

  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    const [key, val] = (value as string).split(/:(.+)/);
    return { key, value: val };
  })
  filter?: { key: string; value: string };
  
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
