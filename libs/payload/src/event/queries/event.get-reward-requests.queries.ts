import { EventDefaultQueries } from './event.default.queries';
import { IsEnum, IsOptional } from 'class-validator';
import { RewardStatus } from '@schema/user-event.schema';

export class EventGetRewardRequestsQueries extends EventDefaultQueries {
  @IsOptional()
  @IsEnum(RewardStatus)
  status?: RewardStatus;
}
