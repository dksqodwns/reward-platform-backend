import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGatewayService } from '../app/auth/auth.gateway.service';
import { AuthAccessTokenPayload } from '@payload/auth';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authGatewayService: AuthGatewayService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: 'JWT_ACCESS_TOKEN_KEY',
    });
  }

  async validate(payload: AuthAccessTokenPayload, done: VerifiedCallback) {
    const user = await this.authGatewayService.getUserByUserId(payload.userId);
    if (!user)
      return done(
        new UnauthorizedException('유효하지 않은 사용자 입니다.'),
        false
      );
    
    return done(null, user);
  }
}
