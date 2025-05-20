import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EventCreatePayload, EventCreateRewardPayload } from '@payload/event';
import { EventDefaultQueries } from '@payload/event/queries/event.default.queries';
import { EventGetListPayload } from '@payload/event/rpc/event.get-list.payload';
import { EventCreateRewardRpcPayload } from '@payload/event/rpc/event.create-reward.rpc.payload';
import { BaseGatewayService } from '../base.gateway.service';
import { EventGetRewardRequestsQueries } from '@payload/event/queries/event.get-reward-requests.queries';

@Injectable()
export class EventGatewayService extends BaseGatewayService {
  constructor(@Inject('EVENT_SERVICE') client: ClientProxy) {
    super(client);
  }

  async createEvent(payload: EventCreatePayload) {
    return this.sendMessage('event:create', payload);
  }

  async getEventList(query: EventDefaultQueries) {
    const payload: EventGetListPayload = { ...query };

    return this.sendMessage('event:getList', payload);
  }

  async getEventByEventKey(key: string) {
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

    return this.sendMessage('event:createReward', payload);
  }

  async getEventRewardList(key: string) {
    return this.sendMessage('event:getRewardList', key);
  }

  async getRewardByRewardKey(rewardKey: string) {
    return this.sendMessage('event:getReward', rewardKey);
  }

  async getRewardRequestList(query: EventGetRewardRequestsQueries) {
    return this.sendMessage('event:getRequests', query);
  }

  async getRewardRequestByUserId(
    userId: string,
    query: EventGetRewardRequestsQueries
  ) {
    const payload = { userId, query };
    return this.sendMessage('event:getUserRequests', payload);
  }
}
