import {IAward} from './IAward';
import {Player} from '../Player';
import {CardName} from '../CardName';

export class DryHeat implements IAward {
  public name: CardName = CardName.DRY_HEAT;
  public description: string = 'Awarded at Game\'s end to the Player with the most Heat Cubes.'
  public getScore(player: Player): number {
    return player.heatCubes;
  }
}
