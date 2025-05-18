/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';
import { AuthModule } from './app/auth.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.TCP,
      options: {
        host: '::',
        port: 3001,
      },
    }
  );
  const conn = app.get<Connection>(getConnectionToken());
  Logger.log(`[AUTH] MongoDB connection state: ${conn.readyState}`);
  await app.listen();
}

bootstrap();
