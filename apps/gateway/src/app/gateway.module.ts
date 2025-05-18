import { Module } from '@nestjs/common';
import { AuthGatewayController } from './auth/auth.gateway.controller';
import { EventGatewayController } from './event/event.gateway.controller';
import { EventGatewayService } from './event/event.gateway.service';
import { AuthGatewayService } from './auth/auth.gateway.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '::',
          port: 3001,
        },
      },
    ]),
    ClientsModule.register([
      {
        name: 'EVENT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '::',
          port: 3002,
        },
      },
    ]),
  ],
  controllers: [AuthGatewayController, EventGatewayController],
  providers: [AuthGatewayService, EventGatewayService],
})
export class GatewayModule {}
