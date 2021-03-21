import {Card} from '../Card';
import {CorporationCard} from './CorporationCard';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class CrusoeEnterprise extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: 'corp',
      name: CardName.CRUSOE_ENTERPRISE,
      startingCredits: 3,
      color: 'grey',

      metadata: {
        description: 'Start with 4 credits.',
        renderData: CardRenderer.builder((b) => {
          b.text('Spend 1 Credit to gain 1 Energy / Nature / Production tag of which you have none.');
        }),
      },
    });
  }
  public play(_player: Player) {
    return undefined;
  }
}
