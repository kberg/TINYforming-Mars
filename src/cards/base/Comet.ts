import {CardName} from '../../CardName';
import {PlaceWaterCube} from '../../deferredActions/PlaceWaterCube';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../Tag';

export class Comet extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: 'project',
      name: CardName.COMET,
      cost: 3,
      tags: [Tag.NATURE, Tag.NATURE],
      color: 'red',

      requirements: CardRequirements.builder((b) => b.energy().space()),
      metadata: {
        renderData: CardRenderer.builder((_b) => {
        }),
        description: 'Gain 1 Heat Cube. You may also place 1 Water Cube if you now have five or more Heat Cubes.',
      },
    });
  }
  public play(player: Player) {
    player.gainHeatCube();
    if (player.heatCubes >= 5) {
      // TODO: offer.
      player.game.defer(new PlaceWaterCube(player, {optional: true}));
    }
    return undefined;
  }
}
