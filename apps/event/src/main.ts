/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';
import { EventModule } from './app/event.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    EventModule,
    { transport: Transport.TCP, options: { host: '::', port: 3002 } }
  );
  const conn = app.get<Connection>(getConnectionToken());
  Logger.log(`[EVENT] MongoDB connection state: ${conn.readyState}`);
  await app.listen();
}

bootstrap();
