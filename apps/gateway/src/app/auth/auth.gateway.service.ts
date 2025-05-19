import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  AuthDefaultQueries,
  AuthLoginPayload,
  AuthRegisterPayload,
  AuthUpdateUserRolePayload,
  Role,
} from '@payload/auth';
import { BaseGatewayService } from '../base.gateway.service';

@Injectable()
export class AuthGatewayService extends BaseGatewayService {
  constructor(@Inject('AUTH_SERVICE') client: ClientProxy) {
    super(client);
  }

  async getUserByUserId(userId: string) {
    // return lastValueFrom(
    //   this.client.send<AuthUserResponsePayload | null>(
    //     { cmd: 'auth:user' },
    //     userId
    //   )
    return this.sendMessage('auth:user', userId);
  }

  async userRegister(body: AuthRegisterPayload) {
    // return lastValueFrom(
    //   this.client.send<{ success: boolean; data: any }>(
    //     { cmd: 'auth:register' },
    //     body
    //   )
    // );
    return this.sendMessage('auth:register', body);
  }

  async userLogin(body: AuthLoginPayload) {
    // return lastValueFrom(
    //   this.client.send<{
    //     success: boolean;
    //     data: { accessToken: string; refreshToken: string };
    //   }>({ cmd: 'auth:login' }, body)
    // );
    return this.sendMessage('auth:login', body);
  }

  async userRefreshAccessToken(oldToken: string) {
    // return lastValueFrom(
    //   this.client.send<{
    //     success: boolean;
    //     data: { accessToken: string; refreshToken: string };
    //   }>({ cmd: 'auth:refresh' }, oldToken)
    // );
    return this.sendMessage('auth:refresh', oldToken);
  }

  async getUserList(query: AuthDefaultQueries) {
    // return lastValueFrom(this.client.send({ cmd: 'auth:userList' }, query));
    return this.sendMessage('auth:userList', query);
  }

  userRoleUpdate(userId: string, roles: Role[]) {
    const payload: AuthUpdateUserRolePayload = { userId, roles };
    // return lastValueFrom(
    //   this.client.send({ cmd: 'auth:updateUserRole' }, payload)
    // );
    return this.sendMessage('auth:updateUserRole', payload);
  }
}
