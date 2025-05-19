import { Role } from '../auth.roles.enum';

export interface AuthUpdateUserRolePayload {
  userId: string;
  roles: Role[];
}
