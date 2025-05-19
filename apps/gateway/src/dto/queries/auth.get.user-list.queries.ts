import { AuthDefaultQueries } from './auth.default.queries';
import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class AuthGetUserListQueries extends AuthDefaultQueries {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    const [key, val] = (value as string).split(/:(.+)/);
    return { key, value: val };
  })
  omit?: { key: string; value: string };

  filter: { key: string; value: string };
}
