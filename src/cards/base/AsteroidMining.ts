import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../Tag';

export class AsteroidMining extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: 'project',
      name: CardName.ASTEROID_MINING,
      cost: 1,
      tags: [Tag.ENERGY, Tag.NATURE],
      color: 'grey',

      requirements: CardRequirements.builder((b) => b.space()),
      metadata: {
        renderData: CardRenderer.builder((_b) => {
        }),
        description: 'Gain 1 Credit each for the Production and/or Space Tags you have on your Project Cards.',
      },
    });
  }
  public play(player: Player) {
    player.gainCredits(player.countTags(Tag.PRODUCTION, {cardsOnly: true}) + player.countTags(Tag.ENERGY, {cardsOnly: true}));
    return undefined;
  }
}
