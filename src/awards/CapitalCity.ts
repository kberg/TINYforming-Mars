import {IAward} from './IAward';
import {Player} from '../Player';
import {CardName} from '../CardName';

export class CapitalCity implements IAward {
  public name: CardName = CardName.CAPITAL_CITY;
  public description: string = 'Awarded at Game\'s end to the player with the highest scoring City.'
  public getScore(player: Player): number {
    return player.heatCubes;
  }
}
