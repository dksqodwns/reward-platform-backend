import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '@common/decorators';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRole: string = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRole) {
      // 적용된 Role Guard가 없을 경우 return
      return true;
    }
    // Request 객체에서 user 추출
    const { user } = context.switchToHttp().getRequest();
    const userRole: string[] = user.roles;

    return userRole.includes(requiredRole);
  }
}
