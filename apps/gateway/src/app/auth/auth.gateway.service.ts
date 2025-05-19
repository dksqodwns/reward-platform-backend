import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  AuthDefaultQueries,
  AuthLoginPayload,
  AuthRegisterPayload,
  AuthUpdateUserRolePayload,
  AuthUserResponsePayload,
  Role,
} from '@payload/auth';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthGatewayService {
  constructor(@Inject('AUTH_SERVICE') private readonly client: ClientProxy) {}

  async getUserByUserId(userId: string) {
    return lastValueFrom(
      this.client.send<AuthUserResponsePayload | null>(
        { cmd: 'auth:user' },
        userId
      )
    );
  }

  async userRegister(body: AuthRegisterPayload) {
    return lastValueFrom(
      this.client.send<{ success: boolean; data: any }>(
        { cmd: 'auth:register' },
        body
      )
    );
  }

  async userLogin(body: AuthLoginPayload) {
    return lastValueFrom(
      this.client.send<{
        success: boolean;
        data: { accessToken: string; refreshToken: string };
      }>({ cmd: 'auth:login' }, body)
    );
  }

  async userRefreshAccessToken(oldToken: string) {
    return lastValueFrom(
      this.client.send<{
        success: boolean;
        data: { accessToken: string; refreshToken: string };
      }>({ cmd: 'auth:refresh' }, oldToken)
    );
  }

  async getUserList(query: AuthDefaultQueries) {
    return lastValueFrom(this.client.send({ cmd: 'auth:userList' }, query));
  }

  userRoleUpdate(userId: string, roles: Role[]) {
    const payload: AuthUpdateUserRolePayload = { userId, roles };
    return lastValueFrom(
      this.client.send({ cmd: 'auth:updateUserRole' }, payload)
    );
  }
}
