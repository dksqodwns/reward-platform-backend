import { Controller } from '@nestjs/common';
import { EventGatewayService } from './event.gateway.service';

@Controller('events')
export class EventGatewayController {
  constructor(private readonly eventGatewayService: EventGatewayService) {}
}
