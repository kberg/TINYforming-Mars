import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../Tag';

export class NuclearPower extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: 'project',
      name: CardName.NUCLEAR_POWER,
      tags: [Tag.NATURE, Tag.SPACE],
      cost: 3,
      color: 'red',

      requirements: CardRequirements.builder((b) => b.production().science()),
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
