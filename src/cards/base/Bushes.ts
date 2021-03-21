import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../Tag';

export class Bushes extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: 'project',
      name: CardName.BUSHES,
      cost: 5,
      tags: [Tag.ENERGY, Tag.ENERGY],
      color: 'green',

      requirements: CardRequirements.builder((b) => b.nature().heat(4)),
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
