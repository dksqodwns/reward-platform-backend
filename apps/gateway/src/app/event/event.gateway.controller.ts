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
import { EventCreateRewardPayload } from '@payload/event';

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

  @Post(':key/rewards')
  async createEventRewardHandler(
    @Param('key') key: string,
    @Body() dto: EventCreateRewardPayload,
    @Req() req: Request
  ) {
    const user = req.user as AuthUserResponsePayload;
    const createdBy = user.userId;
    return this.eventGatewayService.createEventReward(key, dto, createdBy);
  }

  @Get(':key/rewards')
  async getEventRewardList(@Param('key') key: string) {
    return this.eventGatewayService.getEventRewardList(key);
  }

  @Get('/rewards/:rewardKey')
  async getRewardByRewardKey(@Param('rewardKey') rewardKey: string) {
    return this.eventGatewayService.getRewardByRewardKey(rewardKey);
  }
}
