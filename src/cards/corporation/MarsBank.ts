import {Card} from '../Card';
import {CorporationCard} from './CorporationCard';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class MarsBank extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: 'corp',
      name: CardName.MARS_BANK,
      startingCredits: 5,
      color: 'grey',

      metadata: {
        description: 'Start with 5 credits.',
        renderData: CardRenderer.builder((b) => {
          b.text('Whenever you complete a project with an asterisk (*) symbol in the Credit cost, Gain 1 Credit if you did not get to take the specified discount.');
        }),
      },
    });
  }
  public play(_player: Player) {
    return undefined;
  }
}
