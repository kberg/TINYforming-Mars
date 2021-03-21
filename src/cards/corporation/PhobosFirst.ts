import {Card} from '../Card';
import {CorporationCard} from './CorporationCard';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class PhobosFirst extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: 'corp',
      name: CardName.PHOBOS_FIRST,
      startingCredits: 4,
      color: 'grey',

      metadata: {
        description: 'Start with 4 credits.',
        renderData: CardRenderer.builder((b) => {
          b.text('Instead of completing a Standard Project, place your Player Cube on this card and gain 1 Credit and 1 Space Tag (return the cube to your supply at Generation end.');
        }),
      },
    });
  }
  public play(_player: Player) {
    return undefined;
  }
}
