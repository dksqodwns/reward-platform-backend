import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class EventGatewayService {
  constructor(
    @Inject('EVENT_SERVICE') private readonly eventClient: ClientProxy
  ) {}
}
