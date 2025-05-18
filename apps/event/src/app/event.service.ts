import { Injectable } from '@nestjs/common';

@Injectable()
export class EventService {
  getData(): { message: string } {
    return { message: 'Hello API' };
  }
}
