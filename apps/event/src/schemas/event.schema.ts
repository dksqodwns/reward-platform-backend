import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type EventDocument = HydratedDocument<Event>;

@Schema({ _id: false })
class Condition {
  @Prop({ required: true })
  type: string;

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  params: any;
}

const ConditionSchema = SchemaFactory.createForClass(Condition);

@Schema({ _id: false })
class Reward {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ type: MongooseSchema.Types.Mixed, default: {} })
  metadata?: any;
}

const RewardSchema = SchemaFactory.createForClass(Reward);

@Schema({ collection: 'events', timestamps: true })
export class Event {
  @Prop({ required: true, unique: true })
  key: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: ConditionSchema, required: true })
  condition: Condition;

  @Prop({ type: [RewardSchema], required: true })
  rewards: Reward[];

  @Prop({ default: false })
  repeatable: boolean; // TODO: 3번까지 받을 수 있는 이런건 어떻게 구현?

  @Prop({ required: true })
  isActive: boolean;

  @Prop()
  startAt: Date;

  @Prop()
  endAt: Date;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  createdBy: Types.ObjectId;
}

export const EventSchema = SchemaFactory.createForClass(Event);
