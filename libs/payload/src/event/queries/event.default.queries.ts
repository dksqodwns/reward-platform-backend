import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class EventDefaultQueries {
  /**
   * sort=createdAt:asc 또는 sort=name:desc 형태로 받습니다.
   * key: 정렬할 필드명, order: asc | desc
   */
  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    const [key, orderRaw = 'asc'] = (value as string).split(/:(.+)/);
    const order = orderRaw.toLowerCase() === 'desc' ? 'desc' : 'asc';
    return { key, order } as { key: string; order: 'asc' | 'desc' };
  })
  sort?: { key: string; order: 'asc' | 'desc' };

  /**
   * filter=isActive:true 또는 filter=eventKey:WELCOME_EVENT
   */
  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    const [key, val] = (value as string).split(/:(.+)/);
    const parsed =
      val === 'true'
        ? true
        : val === 'false'
        ? false
        : /^\d+$/.test(val)
        ? Number(val)
        : val;
    return { key, value: parsed } as {
      key: string;
      value: string | number | boolean;
    };
  })
  filter?: { key: string; value: string | number | boolean };

  /** 페이지 번호 (1부터 시작) */
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  /** 한 페이지당 항목 수 (최대 100) */
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
