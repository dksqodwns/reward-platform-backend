export interface EventCreateRewardRpcPayload {
  key: string;
  createdBy: string;
  reward: {
    rewardKey: string;
    amount: number;
    maxQuantity: number;
  };
}
