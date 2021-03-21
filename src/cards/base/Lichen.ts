import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../Tag';

export class Lichen extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: 'project',
      name: CardName.LICHEN,
      tags: [Tag.PRODUCTION, Tag.PRODUCTION],
      cost: 2,
      color: 'green',

      requirements: CardRequirements.builder((b) => b.nature(2).heat(2)),
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
