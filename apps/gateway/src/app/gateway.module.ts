import { Module } from '@nestjs/common';
import { AuthGatewayController } from './auth/auth.gateway.controller';
import { EventGatewayController } from './event/event.gateway.controller';
import { EventGatewayService } from './event/event.gateway.service';
import { AuthGatewayService } from './auth/auth.gateway.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { JwtAuthGuard, PermissionsGuard } from '../guards';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: { host: '::', port: 3001 },
      },
      {
        name: 'EVENT_SERVICE',
        transport: Transport.TCP,
        options: { host: '::', port: 3002 },
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'JWT_SECRET_KEY',
      signOptions: { expiresIn: '10m' },
    }),
  ],
  controllers: [AuthGatewayController, EventGatewayController],
  providers: [
    AuthGatewayService,
    EventGatewayService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
  exports: [PassportModule, JwtModule],
})
export class GatewayModule {}
