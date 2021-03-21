import {CardName} from '../../CardName';
import {PlaceHeatCube} from '../../deferredActions/PlaceHeatCube';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../Tag';

export class LavaFlows extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: 'project',
      name: CardName.LAVA_FLOWS,
      cost: 2,
      tags: [Tag.PRODUCTION, Tag.SCIENCE],
      color: 'red',

      requirements: CardRequirements.builder((b) => b.energy(2).nature()),
      metadata: {
        renderData: CardRenderer.builder((_b) => {
        }),
        description: '',
      },
    });
  }
  public play(player: Player) {
    player.game.defer(new PlaceHeatCube(player));
    return undefined;
  }
}
