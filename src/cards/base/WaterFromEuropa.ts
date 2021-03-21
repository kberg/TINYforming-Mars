import {CardName} from '../../CardName';
import {PlaceWaterCube} from '../../deferredActions/PlaceWaterCube';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../Tag';

export class WaterFromEuropa extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: 'project',
      name: CardName.WATER_FROM_EUROPA,
      cost: 3,
      color: 'blue',

      requirements: CardRequirements.builder((b) => b),
      metadata: {
        renderData: CardRenderer.builder((_b) => {
        }),
        description: '',
      },
    });
  }

  public adjustedCost(player: Player) {
    // TODO(kberg): Make it possible for the player to choose not to spend their physical space tag token.
    const tagCount = player.countTags(Tag.SPACE, {cardsOnly: false});
    return Math.max(0, (this.cost - (tagCount - 1)));
  }

  public play(player: Player) {
    player.game.defer(new PlaceWaterCube(player));
    return undefined;
  }
}
