import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { EventCreatePayload, EventCreateRewardPayload } from '@payload/event';
import { EventDefaultQueries } from '@payload/event/queries/event.default.queries';
import { EventGetListPayload } from '@payload/event/rpc/event.get-list.payload';
import { EventCreateRewardRpcPayload } from '@payload/event/rpc/event.create-reward.rpc.payload';
import { ErrorCode } from '@common/error-code.enum';

@Injectable()
export class EventGatewayService {
  constructor(@Inject('EVENT_SERVICE') private readonly client: ClientProxy) {}

  async createEvent(payload: EventCreatePayload) {
    return lastValueFrom(this.client.send({ cmd: 'event:create' }, payload));
  }

  async getEventList(query: EventDefaultQueries) {
    const payload: EventGetListPayload = { ...query };
    return lastValueFrom(this.client.send({ cmd: 'event:getList' }, payload));
  }

  async getEventByEventKey(key: string) {
    return lastValueFrom(this.client.send({ cmd: 'event:get' }, key));
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
    return lastValueFrom(
      this.client.send({ cmd: 'event:createReward' }, payload)
    );
  }

  async getEventRewardList(key: string) {
    return lastValueFrom(
      this.client.send({ cmd: 'event:getRewardList' }, key).pipe(
        catchError((err) => {
          const { code, message } = err;
          const status =
            code === ErrorCode.NOT_FOUND
              ? HttpStatus.NOT_FOUND
              : code === ErrorCode.CONFLICT
              ? HttpStatus.CONFLICT
              : code === ErrorCode.UNAUTHORIZED
              ? HttpStatus.UNAUTHORIZED
              : HttpStatus.INTERNAL_SERVER_ERROR;
          return throwError(() => new HttpException(message, status));
        })
      )
    );
  }

  async getRewardByRewardKey(rewardKey: string) {
    return lastValueFrom(
      this.client.send({ cmd: 'event:getReward' }, rewardKey)
    );
  }
}
