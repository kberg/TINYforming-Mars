import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';
import {IProjectCard} from '../IProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../Tag';

export class GeothermalPower extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: 'project',
      name: CardName.GEOTHERMAL_POWER,
      cost: 3,
      tags: [Tag.SCIENCE, Tag.SPACE],
      color: 'red',

      requirements: CardRequirements.builder((b) => b.production(2).nature()),
      metadata: {
        renderData: CardRenderer.builder((_b) => {
        }),
        description: 'Reduce the cost by 1 Credit for every two Heat Cubes you have (minimum cost of 1). Gain 1 Heat Cube.',
      },
    });
  }

  public adjustedCost(player: Player) {
    return Math.max(1, (this.cost - Math.floor(player.heatCubes / 2)));
  }

  public play(player: Player) {
    player.gainHeatCube();
    return undefined;
  }
}
