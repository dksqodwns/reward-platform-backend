import { Inject, Injectable } from '@nestjs/common';
import { RewardProcessor } from './reward-processor.interface';

@Injectable()
export class RewardProcessorFactory {
  constructor(
    @Inject('POINT') private pointProcessor: RewardProcessor,
    @Inject('COUPON') private couponProcessor: RewardProcessor
  ) {}

  getProcessor(rewardKey: string): RewardProcessor {
    if (rewardKey.startsWith('POINT_')) {
      return this.pointProcessor;
    } else {
      return this.couponProcessor;
    }
  }
}
