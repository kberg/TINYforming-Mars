import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../Tag';

export class AquiferPumping extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: 'project',
      name: CardName.AQUIFER_PUMPING,
      cost: 4,
      tags: [Tag.PRODUCTION, Tag.SPACE],
      color: 'blue',

      requirements: CardRequirements.builder((b) => b.energy().nature()),
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
