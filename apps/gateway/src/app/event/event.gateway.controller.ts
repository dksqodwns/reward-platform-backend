import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EventGatewayService } from './event.gateway.service';

import { Request } from 'Express';
import { EventCreateBodies } from '@payload/event/bodies/event.create-event.payload';
import { Permissions } from '@common/decorators';
import { AuthUserResponsePayload, Permission } from '@payload/auth';
import { JwtAuthGuard, PermissionsGuard } from '../../guards';
import { EventDefaultQueries } from '@payload/event/queries/event.default.queries';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('events')
export class EventGatewayController {
  constructor(private readonly eventGatewayService: EventGatewayService) {}

  @Post()
  @Permissions(Permission.EVENT_CREATE)
  async createEventHandler(
    @Req() req: Request,
    @Body() dto: EventCreateBodies
  ) {
    const user = req.user as AuthUserResponsePayload;
    console.log('유저: ', user);
    return this.eventGatewayService.createEvent({
      ...dto,
      createdBy: user.userId.toString(),
    });
  }

  @Get()
  async getEventListHandler(@Query() query: EventDefaultQueries) {
    return this.eventGatewayService.getEventList(query);
  }

  @Get(':key')
  async getEventByEventKeyHandler(@Param('key') key: string) {
    return this.eventGatewayService.getEventByEventKey(key);
  }
}
