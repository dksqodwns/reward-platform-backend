import { Controller } from '@nestjs/common';
import { EventService } from './event.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EventCreatePayload } from '@payload/event';
import { EventGetListPayload } from '@payload/event/rpc/event.get-list.payload';

@Controller()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @MessagePattern({ cmd: 'event:create' })
  async createEvent(@Payload() payload: EventCreatePayload) {
    return this.eventService.createEvent(payload);
  }

  @MessagePattern({ cmd: 'event:getList' })
  async getEventList(@Payload() payload: EventGetListPayload) {
    return this.eventService.getEventList(payload);
  }

  @MessagePattern({ cmd: 'event:get' })
  async getEventByEventKey(key: string) {
    return this.eventService.getEventByEventKey(key);
  }
}
