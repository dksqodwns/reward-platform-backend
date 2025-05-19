import { ConflictException, Injectable } from '@nestjs/common';
import { EventCreatePayload } from '@payload/event';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventDocument, UserEvent, UserEventDocument } from '../schemas';
import { EventGetListPayload } from '@payload/event/rpc/event.get-list.payload';

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
}
