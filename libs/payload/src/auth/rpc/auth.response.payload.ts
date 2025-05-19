import { Type } from '@nestjs/common';

export interface AuthBaseResponsePayload {
  success: boolean;
  data: Type;
}

export interface AuthUserResponsePayload {
  userId: string;
  email: string;
  userName: string;
  roles: string[];
}
