import { Test } from '@nestjs/testing';
import { EventService } from './event.service';

describe('AuthService', () => {
  let service: EventService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [EventService],
    }).compile();

    service = app.get<EventService>(EventService);
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      expect(service.getData()).toEqual({ message: 'Hello API' });
    });
  });
});
