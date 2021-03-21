import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../Tag';

export class FusionPower extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: 'project',
      name: CardName.FUSION_POWER,
      cost: 2,
      tags: [Tag.PRODUCTION, Tag.NATURE],
      color: 'red',

      requirements: CardRequirements.builder((b) => b.science(2)),
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
