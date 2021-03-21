import {Tag} from '../cards/Tag';
import {ITile} from '../ITile';
import {PlayerId} from '../Player';
import {SpaceType} from '../SpaceType';
import {SpaceId} from './ISpace';

export interface SerializedBoard {
  spaces: Array<SerializedSpace>;
}

export interface SerializedSpace {
  id: SpaceId;
  spaceType: SpaceType;
  tile?: ITile;
  player?: PlayerId;
  tag: Tag | undefined
  x: number;
  y: number;
}
