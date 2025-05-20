import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'users', timestamps: true })
export class User {
  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  userName: string;

  @Prop({ type: [String], default: ['USER'] })
  roles: string[];

  @Prop()
  lastLoginAt?: Date;

  @Prop({ default: 0 })
  consecutiveLoginDays: number;

  @Prop({ default: 0 })
  invitesSent: number;

  @Prop({ default: 0 })
  points: number;

  @Prop({
    type: [
      {
        couponKey: { type: String, required: true },
        issuedAt: { type: Date, default: Date.now },
        expiresAt: { type: Date },
        metadata: { type: MongooseSchema.Types.Mixed, default: {} },
      },
    ],
    default: [],
  })
  coupons: Array<{
    couponKey: string;
    issuedAt: Date;
    expiresAt?: Date;
    metadata?: any;
  }>;

  @Prop({
    type: [
      {
        itemKey: { type: String, required: true },
        quantity: { type: Number, default: 1 },
        metadata: { type: MongooseSchema.Types.Mixed, default: {} },
      },
    ],
    default: [],
  })
  items: Array<{
    itemKey: string;
    quantity: number;
    metadata?: any;
  }>;
}

export const UserSchema = SchemaFactory.createForClass(User);
