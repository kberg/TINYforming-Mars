import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../Tag';

export class IceAsteroid extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: 'project',
      name: CardName.ICE_ASTEROID,
      tags: [Tag.ENERGY, Tag.PRODUCTION],
      cost: 3,
      color: 'blue',

      requirements: CardRequirements.builder((b) => b.space().space()),
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
