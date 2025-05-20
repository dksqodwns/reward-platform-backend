import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CouponRewardProcessor,
  EventConditionEvaluator,
  PointRewardProcessor,
  RewardProcessorFactory,
} from '../utils';
import { Event, EventSchema } from '@schema/event.schema';
import { UserEvent, UserEventSchema } from '@schema/user-event.schema';
import { User, UserSchema } from '@schema/user.schema';
import { RefreshToken, RefreshTokenSchema } from '@schema/refresh-token.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('EVENT_MONGO_URI'),
        autoCreate: true,
        autoIndex: true,
      }),
    }),
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
