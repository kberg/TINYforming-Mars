import {Card} from '../Card';
import {CorporationCard} from './CorporationCard';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class InnovativeSolutions extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: 'corp',
      name: CardName.INNOVATIVE_SOLUTIONS,
      startingCredits: 4,
      color: 'grey',

      metadata: {
        description: 'Start with 4 credits.',
        renderData: CardRenderer.builder((b) => {
          b.text('You may lower the Parameter Requirement of each of your projects by 1 Heat Cube or 1 Water Cube.');
        }),
      },
    });
  }
  public play(_player: Player) {
    return undefined;
  }
}
