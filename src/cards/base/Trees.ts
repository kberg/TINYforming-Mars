import {Board} from '../../boards/Board';
import {CardName} from '../../CardName';
import {SelectSpace} from '../../inputs/SelectSpace';
import {Player} from '../../Player';
import {TileType} from '../../TileType';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../Tag';

export class Trees extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: 'project',
      name: CardName.TREES,
      cost: 2,
      tags: [Tag.SPACE, Tag.SPACE],
      color: 'green',

      requirements: CardRequirements.builder((b) => b.nature().science().heat(5)),
      metadata: {
        renderData: CardRenderer.builder((_b) => {
        }),
        description: '',
      },
    });
  }

  private availableSpaces(board: Board) {
    return board.getAvailableSpacesOnLand().filter((space) => {
      board.getAdjacentSpaces(space).filter((s) => s.tile?.tileType === TileType.GREENERY).length >= 2;
    });
  }
  public canPlay(player: Player) {
    return this.availableSpaces(player.game.board).length > 0;
  };

  public play(player: Player) {
    return new SelectSpace(
      'Select space for greenery',
      this.availableSpaces(player.game.board),
      (space) => {
        player.game.addGreenery(player, space.id);
        return undefined;
      });
  }
}
