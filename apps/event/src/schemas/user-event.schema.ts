import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserEventDocument = HydratedDocument<UserEvent>;

export enum RewardStatus {
  PENDING = 'pending',
  REQUESTED = 'requested',
  REJECTED = 'rejected',
}

@Schema({ collection: 'user_events', timestamps: true })
export class UserEvent {
  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true, index: true })
  eventKey: string;

  @Prop({ enum: RewardStatus, default: RewardStatus.PENDING })
  status: RewardStatus;

  @Prop({ type: Date })
  requestedAt: Date;

  // 이벤트 별 추가 정보 데이터
  @Prop({ type: Object })
  extraData?: any;
}
export const UserEventSchema = SchemaFactory.createForClass(UserEvent);

UserEventSchema.index({ userId: 1, eventKey: 1 }, { unique: true });
