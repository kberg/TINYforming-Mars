import {Card} from '../Card';
import {CorporationCard} from './CorporationCard';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class VeridianIntergalactic extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: 'corp',
      name: CardName.VERIDIAN_INTERGALACTIC,
      startingCredits: 4,
      color: 'grey',

      metadata: {
        description: 'Start with 4 credits.',
        renderData: CardRenderer.builder((b) => {
          b.credits(4).br;
          b.action('Once per generation you may spend 3 Credits to acquire 1 unclaimed Resource Token.', (ab) => ab.startAction.credits(3).colon().water(1));
        }),
      },
    });
  }
  public play(_player: Player) {
    return undefined;
  }
}
