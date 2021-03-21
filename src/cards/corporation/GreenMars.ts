import {Card} from '../Card';
import {CorporationCard} from './CorporationCard';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class GreenMars extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: 'corp',
      name: CardName.GREEN_MARS,
      startingCredits: 3,
      color: 'grey',

      metadata: {
        description: 'Start with 1 Nature Resource Tag Token & 3 credits.',
        renderData: CardRenderer.builder((b) => {
          b.text('Once per generation: you may spend 2 Nature Resource Tokens to place 1 Greenery Cube.');
          b.br;
          b.text('OR: You may exchange 1 of your Credits for 1 of your oponent\'s Nature Resource Tokens.');
        }),
      },
    });
  }
  public play(_player: Player) {
    return undefined;
  }
}
