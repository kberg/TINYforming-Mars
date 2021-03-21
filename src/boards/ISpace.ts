import {SpaceType} from '../SpaceType';
import {ITile} from '../ITile';
import {Player} from '../Player';
import {Tag} from '../cards/Tag';

export type SpaceId = string;

export interface ISpace {
    id: SpaceId;
    spaceType: SpaceType;
    tile?: ITile;
    player?: Player;
    tag: Tag | undefined;
    x: number;
    y: number;
}
