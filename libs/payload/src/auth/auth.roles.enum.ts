import { Permission } from './auth.permissions.enum';

export enum Role {
  USER = 'USER',
  OPERATOR = 'OPERATOR',
  AUDITOR = 'AUDITOR',
  ADMIN = 'ADMIN',
}

export const RolePermissions: Record<Role, Permission[]> = {
  [Role.USER]: [Permission.USER_EVENT_CREATE, Permission.USER_EVENT_READ],
  [Role.OPERATOR]: [
    Permission.EVENT_CREATE,
    Permission.EVENT_READ,
    Permission.EVENT_UPDATE,
    Permission.REWARD_CREATE,
    Permission.REWARD_READ,
    Permission.REWARD_UPDATE,
  ],
  [Role.AUDITOR]: [Permission.USER_EVENT_READ],
  [Role.ADMIN]: Object.values(Permission),
};
