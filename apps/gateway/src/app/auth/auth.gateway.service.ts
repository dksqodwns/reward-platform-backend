import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthLoginBodies, AuthRegisterBodies } from '@payload/auth';
import { lastValueFrom } from 'rxjs';
import { AuthUserResponsePayload } from '@payload/auth/auth.response.payload';

@Injectable()
export class AuthGatewayService {
  constructor(@Inject('AUTH_SERVICE') private readonly client: ClientProxy) {}

  async getUserByUserId(userId: string) {
    return lastValueFrom(
      this.client.send<AuthUserResponsePayload | null>(
        { cmd: 'get:user' },
        userId
      )
    );
  }

  async userRegister(body: AuthRegisterBodies) {
    return lastValueFrom(
      this.client.send<{ success: boolean; data: any }>(
        { cmd: 'register' },
        body
      )
    );
  }

  async userLogin(body: AuthLoginBodies) {
    return lastValueFrom(
      this.client.send<{
        success: boolean;
        data: { accessToken: string; refreshToken: string };
      }>({ cmd: 'login' }, body)
    );
  }

  async userRefreshAccessToken(oldToken: string) {
    return lastValueFrom(
      this.client.send<{
        success: boolean;
        data: { accessToken: string; refreshToken: string };
      }>({ cmd: 'refresh' }, oldToken)
    );
  }
}
