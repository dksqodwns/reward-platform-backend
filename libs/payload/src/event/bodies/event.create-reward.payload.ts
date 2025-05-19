import { IsNumber, IsString, Min } from 'class-validator';

export class EventCreateRewardPayload {
  @IsString()
  rewardKey!: string;

  @IsNumber()
  @Min(1)
  amount!: number;

  @IsNumber()
  @Min(1)
  maxQuantity!: number;
}
