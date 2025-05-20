import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserEventDocument = HydratedDocument<UserEvent>;

export enum RewardStatus {
  PENDING = 'PENDING',
  REQUESTED = 'REQUESTED',
  GRANTED = 'GRANTED',
  REJECTED = 'REJECTED',
}

@Schema({ collection: 'user_events', timestamps: true })
export class UserEvent {
  @Prop({ required: true, index: true })
  userId!: string;

  @Prop({ required: true, index: true })
  eventKey!: string;

  @Prop({ enum: RewardStatus, default: RewardStatus.PENDING })
  status!: RewardStatus;

  @Prop({ type: MongooseSchema.Types.Mixed, default: {} })
  extraData?: any;
}

export const UserEventSchema = SchemaFactory.createForClass(UserEvent);

UserEventSchema.index(
  { userId: 1, eventKey: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: RewardStatus.REQUESTED,
    },
  }
);
