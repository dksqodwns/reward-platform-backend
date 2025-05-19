import {
  ArrayNotEmpty,
  IsEnum,
  IsNumber,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type, TypeHelpOptions } from 'class-transformer';
import { ConditionType } from '../event.condition-types.eum';

export class LoginDaysDto {
  @IsNumber()
  @Min(1)
  days!: number;
}

export class FriendInvitesDto {
  @IsNumber()
  @Min(1)
  count!: number;
}

export class EventConditionPayload {
  @IsEnum(ConditionType)
  type!: ConditionType;

  @ValidateNested()
  @Type((options?: TypeHelpOptions) => {
    const obj = options?.object as EventConditionPayload;
    switch (obj.type) {
      case ConditionType.LOGIN_DAYS:
        return LoginDaysDto;
      case ConditionType.FRIEND_INVITE:
        return FriendInvitesDto;
      default:
        return Object;
    }
  })
  params!: LoginDaysDto | FriendInvitesDto;
}

export class ConditionGroupPayload {
  @IsEnum(['AND', 'OR'])
  operator!: 'AND' | 'OR';

  @ValidateNested({ each: true })
  @Type(() => EventConditionPayload)
  @ArrayNotEmpty()
  rules!: EventConditionPayload[];
}
