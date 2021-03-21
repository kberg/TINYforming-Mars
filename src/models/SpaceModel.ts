
import {Color} from '../Color';
import {TileType} from '../TileType';
import {SpaceType} from '../SpaceType';
import {SpaceId} from '../boards/ISpace';
import {Tag} from '../cards/Tag';

export interface SpaceModel {
    id: SpaceId;
    x: number;
    y: number;
    tag: Tag | undefined;
    color: Color | undefined;
    tileType: TileType | undefined;
    spaceType: SpaceType;
}
