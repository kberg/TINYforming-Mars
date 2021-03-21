import {CardName} from '../../CardName';
import {RemoveCube} from '../../deferredActions/RemoveCube';
import {Player} from '../../Player';
import {TileType} from '../../TileType';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../Tag';

export class Asteroid extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: 'project',
      name: CardName.ASTEROID,
      cost: 4,
      tags: [Tag.PRODUCTION, Tag.PRODUCTION],
      color: 'red',

      requirements: CardRequirements.builder((b) => b.energy().space()),
      metadata: {
        renderData: CardRenderer.builder((_b) => {
        }),
        description: '',
      },
    });
  }
  public play(player: Player) {
    player.gainHeatCube();
    const greeneries = player.game.board.spaces.filter((space) => space.tile?.tileType === TileType.GREENERY);
    player.game.defer(new RemoveCube(player, {spaces: greeneries}));
    return undefined;
  }
}
