// apps/event/src/schemas/event.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type EventDocument = HydratedDocument<Event>;

// 조건: AND/OR + 규칙 배열
@Schema()
class ConditionRule {
  @Prop({ required: true })
  type: string; // ex) 'LOGIN_DAYS', 'INVITE_COUNT'
  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  params: any; // ex) { days: 3 } 등
}

const ConditionRuleSchema = SchemaFactory.createForClass(ConditionRule);

@Schema()
class ConditionGroup {
  @Prop({ required: true, enum: ['AND', 'OR'], default: 'AND' })
  operator: 'AND' | 'OR';
  @Prop({ type: [ConditionRuleSchema], required: true })
  rules: ConditionRule[];
}

const ConditionGroupSchema = SchemaFactory.createForClass(ConditionGroup);

// 이벤트 보상 자체(수량·한도)
@Schema()
class Reward {
  @Prop({ required: true })
  rewardKey: string; // reward_catalog.key 를 참조하는 비즈니스 키
  @Prop({ required: true })
  amount: number; // 지급 수량
  @Prop({ required: true, min: 1 })
  maxQuantity: number; // 이벤트 전체 차원의 최대 지급 횟수
}

const RewardSchema = SchemaFactory.createForClass(Reward);

// 메인 Event 스키마
@Schema({ collection: 'events', timestamps: true })
export class Event {
  @Prop({ required: true, unique: true })
  key: string; // ex) 'WELCOME_EVENT'

  @Prop({ type: ConditionGroupSchema, required: true })
  condition: ConditionGroup;

  @Prop({ type: [RewardSchema], required: true })
  rewards: Reward[];

  @Prop({ default: false })
  repeatable: boolean;

  @Prop({ default: 1, required: true, min: 1 })
  maxTimes: number;

  @Prop({ required: true })
  isActive: boolean;

  @Prop() startAt: Date;
  @Prop() endAt: Date;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  createdBy: Types.ObjectId;
}

export const EventSchema = SchemaFactory.createForClass(Event);
