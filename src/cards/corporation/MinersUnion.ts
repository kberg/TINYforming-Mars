import {Card} from '../Card';
import {CorporationCard} from './CorporationCard';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../Tag';

export class MinersUnion extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: 'corp',
      name: CardName.MINERS_UNION,
      startingCredits: 4,
      tags: [Tag.PRODUCTION],
      color: 'grey',

      metadata: {
        description: 'Start with 4 credits.',
        renderData: CardRenderer.builder((b) => {
          b.text('You have a permanent Production Tag.');
          b.br;
          b.text('Gain 1 Credit whenever you take the Production Resource Token.');
        }),
      },
    });
  }
  public play(_player: Player) {
    return undefined;
  }
}
