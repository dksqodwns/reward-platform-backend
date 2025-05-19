import { ConflictException, Injectable } from '@nestjs/common';
import { EventCreatePayload, EventRewardEmbeddedPayload } from '@payload/event';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventDocument, UserEvent, UserEventDocument } from '../schemas';
import { EventGetListPayload } from '@payload/event/rpc/event.get-list.payload';
import { EventCreateRewardRpcPayload } from '@payload/event/rpc/event.create-reward.rpc.payload';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<EventDocument>,
    @InjectModel(UserEvent.name)
    private readonly userEventModel: Model<UserEventDocument>
  ) {}

  async createEvent(payload: EventCreatePayload) {
    const isExistEvent = await this.eventModel.findOne({ key: payload.key });
    if (isExistEvent) {
      throw new ConflictException(
        `Event Key가 ${payload.key}인 이벤트가 이미 존재합니다.`
      );
    }

    const createdEvent = await this.eventModel.create({
      ...payload,
      createdBy: payload.createdBy,
    });
    return { success: true, data: createdEvent };
  }

  async getEventList(payload: EventGetListPayload) {
    const { sort, filter, page = 1, limit = 10 } = payload;

    const conditions: Record<string, any> = {};
    if (filter?.key === 'isActive') {
      conditions.isActive = filter.value === 'true';
    }

    const sortOption: Record<string, 1 | -1> = {};
    if (sort && ['createdAt', 'key'].includes(sort.key)) {
      sortOption[sort.key] = sort.order === 'asc' ? 1 : -1;
    } else {
      sortOption.createdAt = -1;
    }

    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
      this.eventModel.countDocuments(conditions).exec(),
      this.eventModel
        .find(conditions)
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
    ]);

    return {
      success: true,
      data,
      metadata: {
        page,
        limit,
        total,
        totalPage: Math.ceil(total / limit),
      },
    };
  }

  async getEventByEventKey(key: string) {
    const event = await this.eventModel.findOne({ key }).lean().exec();
    if (!event) return null;

    return { success: true, data: event };
  }

  async createEventReward(payload: EventCreateRewardRpcPayload) {
    const { key, reward } = payload;
    const event = await this.eventModel.findOne({ key });
    if (!event) return null; // TOOD: success: false로 리턴해서 게이트웨이에서 에러 처리?
    if (event.rewards.some((r) => r.rewardKey === reward.rewardKey)) {
      return null; // 이미 등록된 보상키 입니다.
    }

    event.rewards.push(reward);
    const updated = await event.save();

    return { success: true, data: updated };
  }

  async getEventRewardList(key: string) {
    const event = await this.eventModel.findOne({ key }).lean().exec();
    if (!event) return null; // NOT_FOUND

    const data = event.rewards.map((reward) => ({
      eventKey: event.key,
      reward: {
        rewardKey: reward.rewardKey,
        amount: reward.amount,
        maxQuantity: reward.maxQuantity,
      } as EventRewardEmbeddedPayload,
    }));

    return { success: true, data };
  }

  async getRewardByRewardKey(rewardKey: string) {
    const docs = await this.eventModel
      .find(
        { 'rewards.rewardKey': rewardKey },
        { key: 1, name: 1, 'rewards.$': 1 }
      )
      .lean()
      .exec();

    const data = docs.map((doc) => ({
      eventKey: doc.key,
      reward: {
        rewardKey: doc.rewards[0].rewardKey,
        amount: doc.rewards[0].amount,
        maxQuantity: doc.rewards[0].maxQuantity,
      } as EventRewardEmbeddedPayload,
    }));

    return { success: true, data };
  }
}
