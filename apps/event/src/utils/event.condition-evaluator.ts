// apps/event/src/utils/event-condition.evaluator.ts
import { Injectable } from '@nestjs/common';
import { AuthUserResponsePayload } from '@payload/auth';
import {
  ConditionGroup,
  ConditionRule,
  ConditionType,
} from '@schema/event.schema';

@Injectable()
export class EventConditionEvaluator {
  async evaluateRule(
    rule: ConditionRule,
    user: AuthUserResponsePayload
  ): Promise<boolean> {
    switch (rule.type) {
      case ConditionType.LOGIN_DAYS_7:
        return user.consecutiveLoginDays >= 7;
      case ConditionType.FRIEND_INVITE:
        return user.invitesSent > 3;
      default:
        return false;
    }
  }

  async evaluate(
    group: ConditionGroup,
    user: AuthUserResponsePayload
  ): Promise<boolean> {
    const results = await Promise.all(
      group.rules.map((rule) => this.evaluateRule(rule, user))
    );

    if (group.operator === 'AND') {
      return results.every((r) => r);
    } else {
      return results.some((r) => r);
    }
  }
}
