// apps/event/src/utils/event-condition.evaluator.ts
import { Injectable } from '@nestjs/common';
import { AuthUserResponsePayload } from '@payload/auth';
import {
  ConditionGroupPayload,
  ConditionType,
  EventConditionPayload,
} from '@payload/event';

@Injectable()
export class EventConditionEvaluator {
  async evaluateRule(
    rule: EventConditionPayload,
    user: AuthUserResponsePayload
  ): Promise<boolean> {
    switch (rule.type) {
      case ConditionType.FIRST_LOGIN:
        return user.hasLoggedIn === true;

      case ConditionType.FRIEND_INVITE:
        return user.invitesSent > 0;

      default:
        return false;
    }
  }

  async evaluate(
    group: ConditionGroupPayload,
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
