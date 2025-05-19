import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { EventCreatePayload } from '@payload/event';
import { EventDefaultQueries } from '@payload/event/queries/event.default.queries';
import { EventGetListPayload } from '@payload/event/rpc/event.get-list.payload';

@Injectable()
export class EventGatewayService {
  constructor(@Inject('EVENT_SERVICE') private readonly client: ClientProxy) {}

  async createEvent(payload: EventCreatePayload) {
    return lastValueFrom(this.client.send({ cmd: 'event:create' }, payload));
  }

  getEventList(query: EventDefaultQueries) {
    const payload: EventGetListPayload = { ...query };
    return lastValueFrom(this.client.send({ cmd: 'event:getList' }, payload));
  }

  getEventByEventKey(key: string) {
    return lastValueFrom(this.client.send({ cmd: 'event:get' }, key));
  }
}
