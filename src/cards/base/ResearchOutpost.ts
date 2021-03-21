import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../Tag';

export class ResearchOutpost extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: 'project',
      name: CardName.RESEARCH_OUTPOST,
      cost: 1,
      tags: [Tag.ENERGY, Tag.SPACE],
      color: 'grey',

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
