import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type RewardCatalogDocument = HydratedDocument<RewardCatalog>;

@Schema({ collection: 'reward_metadata', timestamps: true })
export class RewardCatalog {
  @Prop({ required: true, unique: true })
  key!: string;

  @Prop({ required: true })
  name!: string; 

  @Prop({ required: true, enum: ['POINT', 'COUPON', 'ITEM'] })
  type!: 'POINT' | 'COUPON' | 'ITEM';

  @Prop({ required: true })
  unit!: string; 

  @Prop({ type: MongooseSchema.Types.Mixed, default: {} })
  metadata: any; 
}

export const RewardCatalogSchema = SchemaFactory.createForClass(RewardCatalog);
