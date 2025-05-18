import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema, UserEvent, UserEventSchema } from '../schemas';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://root:skfk4fkd@localhost:27017/reward_event?authSource=admin',
      {
        // TODO: DB 주소 env
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
  providers: [EventService],
})
export class EventModule {}
