import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import {
  AuthAccessTokenPayload,
  AuthRefreshTokenPayload,
  ReturnAccessTokenPayload,
  ReturnRefreshTokenPayload,
} from '@payload/auth';
import { UserDocument } from '@schema/user.schema';

@Injectable()
export class TokenService {
  // TODO: configService나 env에 넣어서 관리하게 변경이 필요함
  private readonly ACCESS_TOKEN_SECRET = 'JWT_SECRET_KEY';
  private readonly REFRESH_TOKEN_SECRET = 'JWT_SECRET_KEY';
  s;
  constructor(private readonly jwtService: JwtService) {}

  async createAccessToken(
    user: UserDocument
  ): Promise<ReturnAccessTokenPayload> {
    const payload: AuthAccessTokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      roles: user.roles,
    };
    const options: JwtSignOptions = {
      secret: this.ACCESS_TOKEN_SECRET,
      expiresIn: '10m',
    };

    const accessToken = await this.jwtService.signAsync(payload, options);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    return { accessToken, expiresAt };
  }

  async createRefreshToken(
    user: UserDocument
  ): Promise<ReturnRefreshTokenPayload> {
    const payload: AuthRefreshTokenPayload = {
      userId: user._id.toString(),
    };
    const options: JwtSignOptions = {
      secret: this.REFRESH_TOKEN_SECRET,
      expiresIn: '1d',
    };
    const refreshToken = await this.jwtService.signAsync(payload, options);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    return { refreshToken, expiresAt };
  }

  async verifyAccessToken(
    accessToken: string
  ): Promise<AuthAccessTokenPayload> {
    return this.jwtService.verifyAsync(accessToken, {
      secret: this.ACCESS_TOKEN_SECRET,
    });
  }

  async verifyRefreshToken(
    refreshToken: string
  ): Promise<AuthRefreshTokenPayload> {
    return this.jwtService.verifyAsync(refreshToken, {
      secret: this.REFRESH_TOKEN_SECRET,
    });
  }
}
