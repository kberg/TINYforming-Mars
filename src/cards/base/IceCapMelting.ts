import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../Tag';

export class IceCapMelting extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: 'project',
      name: CardName.ICE_CAP_MELTING,
      tags: [Tag.PRODUCTION, Tag.NATURE],
      cost: 3,
      color: 'blue',

      requirements: CardRequirements.builder((b) => b.energy(2).heat(5)),
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
