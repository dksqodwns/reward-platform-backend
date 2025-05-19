import { ArrayNotEmpty, IsArray, IsEnum } from 'class-validator';
import { Role } from '@payload/auth/auth.roles.enum';

export class AuthUpdateUserRoleBodies {
  @IsArray({ message: 'roles는 배열이어야 합니다.' })
  @ArrayNotEmpty({ message: '최소 하나의 역할을 지정해야 합니다.' })
  @IsEnum(Role, { each: true, message: '유효하지 않은 역할 값이 있습니다.' })
  roles!: Role[];
}
