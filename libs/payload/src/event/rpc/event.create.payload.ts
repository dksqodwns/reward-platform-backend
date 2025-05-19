import { EventCreateBodies } from '../bodies';

export interface EventCreatePayload extends EventCreateBodies {
  createdBy: string;
}
