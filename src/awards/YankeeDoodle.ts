import {IAward} from './IAward';
import {Player} from '../Player';
import {CardName} from '../CardName';

export class YankeeDoodle implements IAward {
  public name: CardName = CardName.YANKEE_DOODLE;
  // Blah blah this is wrong.
  public description: string = 'Awarded at Game\'s end to the player with the highest scoring City.'
  public getScore(player: Player): number {
    return player.heatCubes;
  }
}
