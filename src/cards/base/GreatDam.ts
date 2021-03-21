import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../Tag';

export class GreatDam extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: 'project',
      name: CardName.GREAT_DAM,
      tags: [Tag.ENERGY, Tag.SCIENCE],
      cost: 3,
      color: 'red',

      requirements: CardRequirements.builder((b) => b.production().nature().water(2)),
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
