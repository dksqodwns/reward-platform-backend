import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  AuthLoginBodies,
  AuthRegisterBodies,
  UserListQueryPayload,
} from '@payload/auth';
import { AuthUserResponsePayload } from '@payload/auth/auth.response.payload';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'auth:user' })
  getUserByUserId(userId: string): Promise<AuthUserResponsePayload | null> {
    return this.authService.getUserByUserId(userId);
  }

  @MessagePattern({ cmd: 'auth:register' })
  userRegister(@Payload() body: AuthRegisterBodies) {
    return this.authService.userRegister(body);
  }

  @MessagePattern({ cmd: 'auth:login' })
  userLogin(@Payload() body: AuthLoginBodies) {
    return this.authService.userLogin(body);
  }

  @MessagePattern({ cmd: 'auth:refresh' })
  userRefreshAccessToken(@Payload() oldToken: string | undefined) {
    return this.authService.userRefreshAccessToken(oldToken);
  }

  @MessagePattern({ cmd: 'auth:userList' })
  getUserList(@Payload() query: UserListQueryPayload) {
    return this.authService.getUserList(query);
  }
}
