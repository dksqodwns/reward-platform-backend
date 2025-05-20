import { Injectable } from '@nestjs/common';
import { EventCreatePayload, EventRewardEmbeddedPayload } from '@payload/event';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  EventDocument,
  RewardStatus,
  UserEvent,
  UserEventDocument,
} from '../schemas';
import { EventGetListPayload } from '@payload/event/rpc/event.get-list.payload';
import { EventCreateRewardRpcPayload } from '@payload/event/rpc/event.create-reward.rpc.payload';
import { RpcException } from '@nestjs/microservices';
import { ErrorCode } from '@common/error-code.enum';
import { EventConditionEvaluator, RewardProcessorFactory } from '../utils';
import { EventRequestRewardPayload } from '@payload/event/rpc/event.request-reward.payload';
import {
  EventGetRewardRequestListPayload,
  EventGetRewardRequestPayload,
} from '@payload/event/rpc/event.get-reward-requests.payload';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<EventDocument>,
    @InjectModel(UserEvent.name)
    private readonly userEventModel: Model<UserEventDocument>,
    private readonly conditionEvaluator: EventConditionEvaluator,
    private readonly processorFactory: RewardProcessorFactory
  ) {}

  async createEvent(payload: EventCreatePayload) {
    const isExistEvent = await this.eventModel.findOne({ key: payload.key });
    if (isExistEvent) {
      throw new RpcException({
        code: ErrorCode.CONFLICT,
        message: `Event Key가 ${payload.key}인 이벤트가 이미 존재합니다.`,
      });
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
    if (!event) {
      throw new RpcException({
        code: ErrorCode.NOT_FOUND,
        message: '이벤트를 찾을 수 없습니다.',
      });
    }
    if (event.rewards.some((r) => r.rewardKey === reward.rewardKey)) {
      return null; // 이미 등록된 보상키 입니다.
    }

    event.rewards.push(reward);
    const updated = await event.save();

    return { success: true, data: updated };
  }

  async getEventRewardList(key: string) {
    const event = await this.eventModel.findOne({ key }).lean().exec();
    console.log('찾은 이벤트: ', event);
    if (!event) {
      throw new RpcException({
        code: ErrorCode.NOT_FOUND,
        message: '이벤트를 찾을 수 없습니다.',
      });
    }

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

  async UserRequestReward(payload: EventRequestRewardPayload) {
    const { eventKey, user } = payload;
    const event: EventDocument = await this.eventModel
      .findOne({ key: eventKey })
      .lean()
      .exec();
    if (!event) {
      throw new RpcException({
        code: ErrorCode.NOT_FOUND,
        message: `해당하는 이벤트가 존재하지 않습니다. eventKey=${eventKey},`,
      });
    }
    if (!event.isActive) {
      throw new RpcException({
        code: ErrorCode.BAD_REQUEST,
        message: '비활성 이벤트입니다.',
      });
    }
    const now = new Date();
    if (
      (event.startAt && now < event.startAt) ||
      (event.endAt && now > event.endAt)
    ) {
      throw new RpcException({
        code: ErrorCode.BAD_REQUEST,
        message: '이벤트 기간이 아닙니다.',
      });
    }

    const ok = await this.conditionEvaluator.evaluate(event.condition, user);
    if (!ok) {
      throw new RpcException({
        code: ErrorCode.BAD_REQUEST,
        message: '이벤트 조건을 만족하지 않습니다.',
      });
    }

    const userEvent = await this.userEventModel.create({
      userId: user.userId,
      eventKey,
      status: RewardStatus.REQUESTED,
    });

    const counts = await Promise.all(
      event.rewards.map((reward) =>
        this.userEventModel
          .countDocuments({
            eventKey,
            'rewards.rewardKey': reward.rewardKey,
            status: RewardStatus.GRANTED,
          })
          .exec()
      )
    );

    event.rewards.forEach((reward, idx) => {
      if (counts[idx] >= reward.maxQuantity) {
        throw new RpcException({
          code: ErrorCode.INTERNAL,
          message: `보상 '${reward.rewardKey}'는 이미 지급 한도를 초과했습니다.`,
        });
      }
    });

    try {
      await Promise.all(
        event.rewards.map((reward) => {
          const processor = this.processorFactory.getProcessor(
            reward.rewardKey
          );
          return processor.grant(user.userId, {
            rewardKey: reward.rewardKey,
            amount: reward.amount,
            maxQuantity: reward.maxQuantity,
          });
        })
      );

      userEvent.status = RewardStatus.GRANTED;
      await userEvent.save();
      return { success: true, data: userEvent };
    } catch (error) {
      userEvent.status = RewardStatus.REJECTED;
      await userEvent.save();
      if (error.code === 11000) {
        throw new RpcException({
          code: ErrorCode.CONFLICT,
          message: `이미 접수 된 요청입니다. 실패 요청 기록 ${userEvent}`,
        });
      } else {
        throw new RpcException({
          code: ErrorCode.INTERNAL,
          message: '보상 지급 중 오류가 발생하였습니다.',
        });
      }
    }
  }

  private async paginateRequests(
    baseCond: Record<string, any>,
    sort?: { key: string; order: 'asc' | 'desc' },
    page = 1,
    limit = 10
  ) {
    const sortOption: Record<string, 1 | -1> = {};
    if (sort) {
      sortOption[sort.key] = sort.order === 'asc' ? 1 : -1;
    } else {
      sortOption.requestedAt = -1;
    }

    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
      this.userEventModel.countDocuments(baseCond).exec(),
      this.userEventModel
        .find(baseCond)
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

  async getRewardRequestList(payload: EventGetRewardRequestListPayload) {
    const { filter, status, sort, page, limit } = payload;
    const conditions: any = {};
    if (status) conditions.status = status;
    if (filter) conditions[filter.key] = filter.value;
    return this.paginateRequests(conditions, sort, page, limit);
  }

  async getRewardRequest(payload: EventGetRewardRequestPayload) {
    const { userId, filter, status, sort, page, limit } = payload;
    const conditions: any = { userId };
    if (status) conditions.status = status;
    if (filter) conditions[filter.key] = filter.value;
    return this.paginateRequests(conditions, sort, page, limit);
  }
}
