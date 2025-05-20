import { EventDefaultQueries } from '@payload/event';
import { IsEnum, IsOptional } from 'class-validator';
import { RewardStatus } from '../../../../../apps/event/src/schemas';

export class EventGetRewardRequestsQueries extends EventDefaultQueries {
  @IsOptional()
  @IsEnum(RewardStatus)
  status?: RewardStatus;
}
