import { InjectModel } from '@nestjs/mongoose';
import { Model, Promise } from 'mongoose';
import { RewardProcessor } from './reward-processor.interface';
import { Injectable } from '@nestjs/common';
import { User, UserDocument } from '@schema/user.schema';

@Injectable()
export class CouponRewardProcessor implements RewardProcessor {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {}

  async grant(
    userId: string,
    reward: { rewardKey: string; amount: number; maxQuantity: number }
  ): Promise<void> {
    const coupons = Array.from({ length: reward.amount }, () => ({
      couponKey: reward.rewardKey,
      issuedAt: new Date(),
      metadata: {},
    }));

    await this.userModel
      .updateOne(
        { _id: userId },
        {
          $push: {
            coupons: {
              $each: coupons,
            },
          },
        }
      )
      .exec();
  }
}
