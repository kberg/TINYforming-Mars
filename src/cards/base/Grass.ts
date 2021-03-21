import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../Tag';

export class Grass extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.GRASS,
      cost: 2,
      tags: [Tag.ENERGY, Tag.PRODUCTION],
      cardType: 'project',
      color: 'green',

      requirements: CardRequirements.builder((b) => b.nature(3).heat(3)),
      metadata: {
        renderData: CardRenderer.builder((_b) => {
        }),
        description: 'Place 1 Greenery Cube. It must be placed in a hex adjacent to a city',
      },
    });
  }
  public play(_player: Player) {
    return undefined;
  }
}
