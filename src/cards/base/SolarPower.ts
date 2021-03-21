import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../Tag';

export class SolarPower extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: 'project',
      name: CardName.SOLAR_POWER,
      tags: [Tag.ENERGY, Tag.NATURE],
      cost: 3,
      color: 'red',

      requirements: CardRequirements.builder((b) => b.production().energy()),
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
