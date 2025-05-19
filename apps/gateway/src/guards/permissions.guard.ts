import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY, PERMISSIONS_KEY } from '@common/decorators';
import { Permission } from '@payload/auth/auth.permissions.enum';
import { Role, RolePermissions } from '@payload/auth/auth.roles.enum';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (isPublic) return true;

    const requiredPermission: Permission[] = this.reflector.getAllAndOverride(
      PERMISSIONS_KEY,
      [ctx.getHandler(), ctx.getClass()]
    );
    if (!requiredPermission?.length) return true;

    const { user } = ctx.switchToHttp().getRequest();
    if (!user?.roles) {
      throw new ForbiddenException('사용자 정보가 올바르지 않습니다.');
    }

    const userPermissions = new Set<Permission>(
      user.roles.flatMap((role: Role) => RolePermissions[role] || [])
    );

    const missing = requiredPermission.filter(
      (permission) => !userPermissions.has(permission)
    );
    if (missing.length > 0) {
      throw new ForbiddenException(`필요 권한: ${missing.join(', ')}`);
    }

    return true;
  }
}
