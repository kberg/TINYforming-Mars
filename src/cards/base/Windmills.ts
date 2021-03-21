import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../Tag';

export class Windmills extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: 'project',
      name: CardName.WINDMILLS,
      cost: 4,
      tags: [Tag.NATURE, Tag.NATURE],
      color: 'red',

      requirements: CardRequirements.builder((b) => b.energy(2)),
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
