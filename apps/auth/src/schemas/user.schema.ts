import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

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

  @Prop({ default: false })
  hasLoggedIn: boolean;

  @Prop({ default: 0 })
  invitesSent: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
