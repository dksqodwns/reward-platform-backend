import { SetMetadata } from '@nestjs/common';
import { Permission } from '@payload/auth/auth.permissions.enum';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
