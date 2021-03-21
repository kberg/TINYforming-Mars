import {CardName} from '../../CardName';
import {PlaceGreeneryCube} from '../../deferredActions/PlaceGreeneryCube';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../Tag';

export class ProtectedValley extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: 'project',
      name: CardName.PROTECTED_VALLEY,
      tags: [Tag.ENERGY, Tag.ENERGY],
      cost: 4,
      color: 'green',

      requirements: CardRequirements.builder((b) => b.nature(2).heat(2)),
      metadata: {
        renderData: CardRenderer.builder((_b) => {
        }),
        description: '',
      },
    });
  }
  public play(player: Player) {
    const availableWaterSpaces = player.game.board.getAvailableSpacesForWaterCubes();
    player.game.defer(new PlaceGreeneryCube(player, {spaces: availableWaterSpaces}));
    return undefined;
  }
}
