import {IMilestone} from './IMilestone';
import {Player} from '../Player';
import {CardName} from '../CardName';

export class Collector implements IMilestone {
  public name = CardName.COLLECTOR;
  public description = 'Have 2 or more different Resource Tokens.'

  public getScore(_player: Player): number {
    // return player.getResourceTokens().length;
    return 0;
  }
  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 2;
  }
}
