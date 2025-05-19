export interface EventGetRewardListPayload {
  rewardKey: string;
}

export interface EventRewardEmbeddedPayload {
  rewardKey: string;
  amount: number;
  maxQuantity: number;
}
