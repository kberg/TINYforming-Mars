import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../Tag';

export class SubterraneanReservoir extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: 'project',
      name: CardName.SUBTERRANEAN_RESERVOIR,
      tags: [Tag.ENERGY, Tag.ENERGY],
      cost: 3,
      color: 'blue',

      requirements: CardRequirements.builder((b) => b.nature().science()),
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
