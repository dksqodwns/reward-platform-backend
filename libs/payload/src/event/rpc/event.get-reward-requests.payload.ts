import { EventGetListPayload } from '@payload/event/rpc/event.get-list.payload';
import { RewardStatus } from '../../../../../apps/event/src/schemas';

export interface EventGetRewardRequestListPayload extends EventGetListPayload {
  status?: RewardStatus;
}

export interface EventGetRewardRequestPayload extends EventGetListPayload {
  userId: string;
  status?: RewardStatus;
}
