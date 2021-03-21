import {CardName} from '../CardName';
import {Player} from '../Player';

export interface IMilestone {
    name: CardName;
    description: string;
    canClaim: (player: Player) => boolean;
    getScore: (player: Player) => number;
}
