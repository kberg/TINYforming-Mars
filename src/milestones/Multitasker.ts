import {IMilestone} from './IMilestone';
import {Player} from '../Player';
import {CardName} from '../CardName';

export class Multitasker implements IMilestone {
  public name = CardName.MUILTITASKER;
  public description = 'Gain or Place 2 different types of Parameter Cubes in the same Generation.'

  public getScore(player: Player): number {
    return player.resourceTagTokens.entries().length;
  }
  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 2;
  }
}
