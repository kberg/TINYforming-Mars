import {IAward} from './IAward';
import {Player} from '../Player';
import {CardName} from '../CardName';
import {TileType} from '../TileType';

export class WaterfrontProperty implements IAward {
  public name: CardName = CardName.WATERFRONT_PROPERTY;
  public description: string = 'Awarded at Game\'s end to the player with the most Water Cubes adjacent to both of their cities. The same Water Cub'
  public getScore(player: Player): number {
    const board = player.game.board;
    const waterCubes = board.spaces.map((space) => {
      if (space.tile?.tileType === TileType.CITY && space.player === player) {
        board.getAdjacentSpaces(space).filter((s) => s.tile?.tileType === TileType.WATER).length;
      }
      return 0;
    });
    return waterCubes.reduce((prior, current) => prior + current, 0);
  }
}
