import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY, ROLES_KEY } from '@common/decorators';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const requiredRole = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 적용된 Role Guard가 없을 경우 return
    if (!requiredRole) {
      return true;
    }
    // Request 객체에서 user 추출
    const { user } = context.switchToHttp().getRequest();
    if (!user || !Array.isArray(user.roles)) {
      throw new ForbiddenException('사용자 정보가 올바르지 않습니다.');
    }
    // 유저가 보유한 roles 배열에 권한이 존재하는지 확인
    const hasRole = requiredRole.some((role) => user.roles.includes(role));

    if (!hasRole) {
      throw new ForbiddenException(
        `[${requiredRole.join(', ')}] 권한이 필요합니다.`
      );
    }
    return hasRole;
  }
}
