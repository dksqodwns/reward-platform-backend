import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  AuthLoginPayload,
  AuthRegisterPayload,
  AuthUpdateUserRolePayload,
  AuthUserResponsePayload,
  UserListQueryPayload,
} from '@payload/auth';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'auth:user' })
  getUserByUserId(userId: string): Promise<AuthUserResponsePayload | null> {
    return this.authService.getUserByUserId(userId);
  }

  @MessagePattern({ cmd: 'auth:register' })
  userRegister(@Payload() body: AuthRegisterPayload) {
    return this.authService.userRegister(body);
  }

  @MessagePattern({ cmd: 'auth:login' })
  userLogin(@Payload() payload: AuthLoginPayload) {
    return this.authService.userLogin(payload);
  }

  @MessagePattern({ cmd: 'auth:refresh' })
  userRefreshAccessToken(@Payload() oldToken: string | undefined) {
    return this.authService.userRefreshAccessToken(oldToken);
  }

  @MessagePattern({ cmd: 'auth:userList' })
  getUserList(@Payload() query: UserListQueryPayload) {
    return this.authService.getUserList(query);
  }

  @MessagePattern({ cmd: 'auth:updateUserRole' })
  updateUserRole(@Payload() payload: AuthUpdateUserRolePayload) {
    return this.authService.updateUserRole(payload);
  }
}
