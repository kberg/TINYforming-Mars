import {Card} from '../Card';
import {CorporationCard} from './CorporationCard';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class UNTerraformingProgramme extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: 'corp',
      name: CardName.UN_TERRAFORMING_PROGRAMME,
      startingCredits: 4,
      color: 'grey',

      metadata: {
        description: 'Start with 4 credits.',
        renderData: CardRenderer.builder((b) => {
          b.text('If you have a red, a blue, and a green project available in this generation, you may activate a 2nd Standard Project with a 1 Credit discount.');
        }),
      },
    });
  }
  public play(_player: Player) {
    return undefined;
  }
}
