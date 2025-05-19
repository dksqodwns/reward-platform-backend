import {
  ArrayNotEmpty,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ConditionGroupPayload } from './event.condition.payload';

class RewardPayload {
  @IsString()
  rewardKey!: string;

  @IsNumber()
  @Min(1)
  amount!: number;

  @IsNumber()
  @Min(1)
  maxQuantity!: number;
}

export class EventCreateBodies {
  @IsString()
  key!: string;

  @ValidateNested()
  @Type(() => ConditionGroupPayload)
  condition!: ConditionGroupPayload;

  @ValidateNested({ each: true })
  @Type(() => RewardPayload)
  @ArrayNotEmpty()
  rewards!: RewardPayload[];

  @IsBoolean()
  isActive!: boolean;

  @IsBoolean()
  repeatable!: boolean;

  @IsNumber()
  @Min(1)
  maxTimes!: number;

  @IsDateString()
  startAt!: string;

  @IsDateString()
  endAt!: string;
}
