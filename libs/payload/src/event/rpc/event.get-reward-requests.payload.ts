import { RewardStatus } from '@schema/user-event.schema';
import { EventGetListPayload } from './event.get-list.payload';

export interface EventGetRewardRequestListPayload extends EventGetListPayload {
  status?: RewardStatus;
}

export interface EventGetRewardRequestPayload extends EventGetListPayload {
  userId: string;
  status?: RewardStatus;
}
