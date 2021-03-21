import {IMilestone} from './IMilestone';
import {Player} from '../Player';
import {CardName} from '../CardName';

export class JackOfAllTrades implements IMilestone {
  public name = CardName.JACK_OF_ALL_TRADES;
  public description = 'Have at least 1 of each Tag type in the same Generation: Energy, Production, ature, Science, and Space.'

  public getScore(player: Player): number {
    return player.getAllTags().length;
  }
  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 5;
  }
}
