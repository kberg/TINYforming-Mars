import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../Tag';

export class Moss extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: 'project',
      name: CardName.MOSS,
      tags: [Tag.PRODUCTION, Tag.PRODUCTION],
      cost: 4,
      color: 'green',

      requirements: CardRequirements.builder((b) => b.nature(2).water(1)),
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
