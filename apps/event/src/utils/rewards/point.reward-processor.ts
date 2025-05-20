import { RewardProcessor } from './reward-processor.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { User, UserDocument } from '../../../../auth/src/schemas';
import { Model } from 'mongoose';

@Injectable()
export class PointRewardProcessor implements RewardProcessor {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {}

  async grant(
    userId: string,
    reward: { rewardKey: string; amount: number }
  ): Promise<void> {
    await this.userModel.updateOne(
      { _id: userId },
      { $inc: { points: reward.amount } }
    );
  }
}
