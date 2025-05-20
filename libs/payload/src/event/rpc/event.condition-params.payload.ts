import { ConditionType } from '../event.condition-types.eum';

export interface LoginDaysParams {
  days: number;
}

export interface FriendInviteParams {
  count: number;
}

export type ConditionParams =
  | {
      type: ConditionType.LOGIN_DAYS_7;
      params: LoginDaysParams;
    }
  | {
      type: ConditionType.FRIEND_INVITE;
      params: FriendInviteParams;
    };
