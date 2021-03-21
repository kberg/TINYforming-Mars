import {IMilestone} from './IMilestone';
import {Player} from '../Player';
import {CardName} from '../CardName';
import {Tag} from '../cards/Tag';

export class Charger implements IMilestone {
  public name = CardName.CHARGER;
  public description = 'Have 4 or more Energy Tags in the same Generation.'

  public getScore(player: Player): number {
    return player.countTags(Tag.ENERGY);
  }
  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 4;
  }
}
