import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import {
  CouponRewardProcessor,
  EventConditionEvaluator,
  PointRewardProcessor,
  RewardProcessorFactory,
} from '../utils';
import { EventSchema } from '@schema/event.schema';
import { UserEvent, UserEventSchema } from '@schema/user-event.schema';
import { User, UserSchema } from '@schema/user.schema';
import { RefreshToken, RefreshTokenSchema } from '@schema/refresh-token.schema';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://root:skfk4fkd@localhost:27017/reward_event?authSource=admin',
      {
        autoCreate: true,
        autoIndex: true,
      } as MongooseModuleOptions
    ),
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: UserEvent.name, schema: UserEventSchema },
      { name: User.name, schema: UserSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
  ],
  controllers: [EventController],
  providers: [
    EventService,
    EventConditionEvaluator,
    PointRewardProcessor,
    { provide: 'POINT', useExisting: PointRewardProcessor },
    CouponRewardProcessor,
    { provide: 'COUPON', useExisting: CouponRewardProcessor },
    RewardProcessorFactory,
  ],
})
export class EventModule {}
