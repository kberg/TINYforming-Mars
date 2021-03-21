import {CardName} from '../CardName';
import {Player} from '../Player';

export interface IAward {
    name: CardName;
    description: string;
    getScore: (player: Player) => number;
}
