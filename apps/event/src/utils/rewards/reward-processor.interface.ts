export interface RewardProcessor {
  grant(
    userId: string,
    reward: { rewardKey: string; amount: number; maxQuantity: number }
  ): Promise<void>;
}
