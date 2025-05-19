import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthLoginBodies, AuthRegisterBodies } from '@payload/auth';
import { lastValueFrom } from 'rxjs';
import { AuthUserResponsePayload } from '@payload/auth/auth.response.payload';
import { AuthDefaultQueries } from '../../dto/queries/auth.default.queries';

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

  async userRegister(body: AuthRegisterBodies) {
    return lastValueFrom(
      this.client.send<{ success: boolean; data: any }>(
        { cmd: 'auth:register' },
        body
      )
    );
  }

  async userLogin(body: AuthLoginBodies) {
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
}
