import {Card} from '../Card';
import {CorporationCard} from './CorporationCard';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class SolInvictus extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: 'corp',
      name: CardName.SOL_INVICTUS,
      startingCredits: 4,
      color: 'grey',

      metadata: {
        description: 'Start with 4 credits.',
        renderData: CardRenderer.builder((b) => {
          b.text('If you have at least 3 Heat Cubes, you may sell Resource Tokens for 2 Credits each.');
          b.br;
          b.text('If you have 5 or more Heat Cubes, you may sell Resource Tokens for 3 Credits each.');
        }),
      },
    });
  }
  public play(_player: Player) {
    return undefined;
  }
}
