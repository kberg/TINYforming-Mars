import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../Tag';

export class ArtificialLake extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: 'project',
      name: CardName.ARTIFICIAL_LAKE,
      cost: 2,
      tags: [Tag.PRODUCTION, Tag.PRODUCTION],
      color: 'blue',

      requirements: CardRequirements.builder((b) => b.production(2).heat(4)),
      metadata: {
        renderData: CardRenderer.builder((_b) => {
        }),
        description: '',
      },
    });
  }
  public play(_player: Player) {
    return undefined;
  }
}
