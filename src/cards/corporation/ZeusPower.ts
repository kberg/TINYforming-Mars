import {Card} from '../Card';
import {CorporationCard} from './CorporationCard';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class ZeusPower extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: 'corp',
      name: CardName.ZEUS_POWER,
      startingCredits: 4,
      color: 'grey',

      metadata: {
        description: 'Start with 4 credits.',
        renderData: CardRenderer.builder((b) => {
          b.text('You may use any Resource Token as an Energy Resource Token.');
          b.br;
          b.text('Gain 1 Credit after completing a Project that has 2 or more Energy Tags in its Requirement.');
        }),
      },
    });
  }
  public play(_player: Player) {
    return undefined;
  }
}
