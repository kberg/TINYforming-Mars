import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../Tag';

export class Insects extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: 'project',
      name: CardName.INSECTS,
      tags: [Tag.PRODUCTION, Tag.SPACE],
      cost: 2,
      color: 'green',

      // TODO(kberg): adjust requirements.
      requirements: CardRequirements.builder((b) => b.nature().science().heat(6).asterisk()),
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
