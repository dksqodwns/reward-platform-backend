import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type RewardCatalogDocument = HydratedDocument<RewardCatalog>;

@Schema({ collection: 'reward_metadata', timestamps: true })
export class RewardCatalog {
  @Prop({ required: true, unique: true })
  key!: string; // ex) 'WELCOME_POINT', 'WELCOME_COUPON'

  @Prop({ required: true })
  name!: string; // UI 노출명, ex) '환영 포인트', '가입 쿠폰'

  @Prop({ required: true, enum: ['POINT', 'COUPON', 'ITEM'] })
  type!: 'POINT' | 'COUPON' | 'ITEM';

  @Prop({ required: true })
  unit!: string; // ex) 'P', 'KRW', 'ITEM_ID'

  @Prop({ type: MongooseSchema.Types.Mixed, default: {} })
  metadata: any; // 추가 속성(ex: 쿠폰 할인율, 만료일 등)
}

export const RewardCatalogSchema = SchemaFactory.createForClass(RewardCatalog);
