import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EventCreatePayload, EventCreateRewardPayload } from '@payload/event';
import { EventDefaultQueries } from '@payload/event/queries/event.default.queries';
import { EventGetListPayload } from '@payload/event/rpc/event.get-list.payload';
import { EventCreateRewardRpcPayload } from '@payload/event/rpc/event.create-reward.rpc.payload';
import { BaseGatewayService } from '../base.gateway.service';

@Injectable()
export class EventGatewayService extends BaseGatewayService {
  constructor(@Inject('EVENT_SERVICE') client: ClientProxy) {
    super(client);
  }

  async createEvent(payload: EventCreatePayload) {
    // return lastValueFrom(this.client.send({ cmd: 'event:create' }, payload));
    return this.sendMessage('event:create', payload);
  }

  async getEventList(query: EventDefaultQueries) {
    const payload: EventGetListPayload = { ...query };
    // return lastValueFrom(this.client.send({ cmd: 'event:getList' }, payload));
    return this.sendMessage('event:getList', payload);
  }

  async getEventByEventKey(key: string) {
    // return lastValueFrom(this.client.send({ cmd: 'event:get' }, key));
    return this.sendMessage('event:get', key);
  }

  async createEventReward(
    key: string,
    dto: EventCreateRewardPayload,
    createdBy: string
  ) {
    const payload: EventCreateRewardRpcPayload = {
      key,
      reward: dto,
      createdBy,
    };
    // return lastValueFrom(
    //   this.client.send({ cmd: 'event:createReward' }, payload)
    // );
    return this.sendMessage('event:createReward', payload);
  }

  async getEventRewardList(key: string) {
    // return lastValueFrom(this.client.send({ cmd: 'event:getRewardList' }, key));
    return this.sendMessage('event:getRewardList', key);
  }

  async getRewardByRewardKey(rewardKey: string) {
    // return lastValueFrom(
    //   this.client.send({ cmd: 'event:getReward' }, rewardKey)
    // );
    return this.sendMessage('event:getReward', rewardKey);
  }
}
