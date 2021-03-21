import {IMilestone} from './IMilestone';
import {Player} from '../Player';
import {CardName} from '../CardName';

export class Discounter implements IMilestone {
  public name = CardName.DISCOUNTER;
  public description = 'Complete 2 or more Projects in the same Generation with the * symbol in their costs.'

  public getScore(_player: Player): number {
    // player.getDiscountActions();
    return 0;
  }
  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 2;
  }
}
