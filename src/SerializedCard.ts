import {CardName} from './CardName';
import {Tag} from './cards/Tag';

export interface SerializedCard {
  allTags?: Array<Tag>;
  isDisabled?: boolean;
  name: CardName;
  resourceCount?: number;
  targetCards?: Array<SerializedRobotCard>;
}

export interface SerializedRobotCard {
  card: SerializedCard;
  resourceCount: number;
}
