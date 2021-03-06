import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {MAX_VENUS_SCALE, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';

export class GiantSolarShade extends Card {
  constructor() {
    super({
      name: CardName.GIANT_SOLAR_SHADE,
      cardType: CardType.AUTOMATED,
      tags: [Tags.SPACE, Tags.VENUS],
      cost: 27,

      metadata: {
        cardNumber: '229',
        renderData: CardRenderer.builder((b) => b.venus(3)),
        description: 'Raise Venus 3 steps.',
      },
    });
  };

  public canPlay(player: Player, game: Game): boolean {
    const remainingVenusSteps = (MAX_VENUS_SCALE - game.getVenusScaleLevel()) / 2;
    const stepsRaised = Math.min(remainingVenusSteps, 3);

    if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
      return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST * stepsRaised, game, false, true, true);
    }

    return true;
  }

  public play(player: Player, game: Game) {
    return game.increaseVenusScaleLevel(player, 3);
  }
}

