import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../Tag';

export class PowerGrid extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: 'project',
      name: CardName.POWER_GRID,
      tags: [Tag.NATURE, Tag.SCIENCE],
      cost: 5,
      color: 'red',

      requirements: CardRequirements.builder((b) => b.energy().production()),
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
