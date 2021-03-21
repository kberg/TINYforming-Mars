import {IMilestone} from './IMilestone';
import {Player} from '../Player';
import {CardName} from '../CardName';
import {Tag} from '../cards/Tag';

export class Explorer implements IMilestone {
  public name = CardName.EXPLORER;
  public description = 'Have 3 or more Science Tags or 3 or more Space Tags in the same Generation.'

  public getScore(player: Player): number {
    return Math.max(player.countTags(Tag.ENERGY), player.countTags(Tag.SPACE));
  }
  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 3;
  }
}
