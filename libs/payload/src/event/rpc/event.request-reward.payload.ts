import { AuthUserResponsePayload } from '@payload/auth';

export interface EventRequestRewardPayload {
  eventKey: string;
  user: AuthUserResponsePayload;
}
