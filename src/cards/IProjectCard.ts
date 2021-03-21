import {ICard} from './ICard';
import {Player} from '../Player';

export interface IProjectCard extends ICard {
  canPlay?: (player: Player) => boolean;
  cost?: number;
}
