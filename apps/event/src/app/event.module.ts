import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema, UserEvent, UserEventSchema } from '../schemas';
import {
  CouponRewardProcessor,
  EventConditionEvaluator,
  PointRewardProcessor,
  RewardProcessorFactory,
} from '../utils';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://root:skfk4fkd@localhost:27017/reward_event?authSource=admin',
      {
        autoCreate: true,
        autoIndex: true,
      }
    ),
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: UserEvent.name, schema: UserEventSchema },
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
