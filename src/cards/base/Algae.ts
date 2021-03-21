import {Board} from '../../boards/Board';
import {CardName} from '../../CardName';
import {PlaceGreeneryCube} from '../../deferredActions/PlaceGreeneryCube';
import {Player} from '../../Player';
import {TileType} from '../../TileType';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../Tag';

export class Algae extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: 'project',
      name: CardName.ALGAE,
      cost: 2,
      tags: [Tag.SCIENCE, Tag.SCIENCE],
      color: 'green',

      requirements: CardRequirements.builder((b) => b.energy().nature().water(2)),
      metadata: {
        renderData: CardRenderer.builder((_b) => {
        }),
        description: 'Place 1 Greenery Cube. It must be placed on a hex adjacent to at least one Water Cube.',
      },
    });
  }

  private availableSpaces(board: Board) {
    return board.getAvailableSpacesOnLand().filter((space) => {
      return board.getAdjacentSpaces(space).find((s) => s.tile?.tileType === TileType.WATER);
    });
  }

  public canPlay(player: Player) {
    return super.canPlay(player) && this.availableSpaces(player.game.board).length > 0;
  }

  public play(player: Player) {
    player.game.defer(new PlaceGreeneryCube(player, {spaces: this.availableSpaces(player.game.board)}));
    return undefined;
  }
}
