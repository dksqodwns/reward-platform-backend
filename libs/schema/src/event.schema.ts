// apps/event/src/schemas/event.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type EventDocument = HydratedDocument<Event>;

export enum ConditionType {
  LOGIN_DAYS_7 = 'LOGIN_DAYS_7',
  FRIEND_INVITE = 'FRIEND_INVITE',
}

@Schema()
export class ConditionRule {
  @Prop({
    required: true,
    enum: Object.values(ConditionType),
  })
  type!: ConditionType;
  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  params: any;
}

const ConditionRuleSchema = SchemaFactory.createForClass(ConditionRule);

@Schema()
export class ConditionGroup {
  @Prop({ required: true, enum: ['AND', 'OR'], default: 'AND' })
  operator!: 'AND' | 'OR';
  @Prop({ type: [ConditionRuleSchema], required: true })
  rules!: ConditionRule[];
}

const ConditionGroupSchema = SchemaFactory.createForClass(ConditionGroup);

@Schema()
export class Reward {
  @Prop({ required: true })
  rewardKey!: string;
  @Prop({ required: true })
  amount!: number;
  @Prop({ required: true, min: 1 })
  maxQuantity!: number;
}

const RewardSchema = SchemaFactory.createForClass(Reward);

@Schema({ collection: 'events', timestamps: true })
export class Event {
  @Prop({ required: true, unique: true })
  key!: string;

  @Prop({ type: ConditionGroupSchema, required: true })
  condition!: ConditionGroup;

  @Prop({ type: [RewardSchema], required: true })
  rewards!: Reward[];

  @Prop({ default: 1, required: true, min: 1 })
  maxTimes!: number;

  @Prop({ required: true })
  isActive!: boolean;

  @Prop() startAt!: Date;
  @Prop() endAt!: Date;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  createdBy!: Types.ObjectId;
}

export const EventSchema = SchemaFactory.createForClass(Event);
