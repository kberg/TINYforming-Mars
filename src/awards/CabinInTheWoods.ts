import {IAward} from './IAward';
import {Player} from '../Player';
import {CardName} from '../CardName';
import {TileType} from '../TileType';

export class CabinInTheWoods implements IAward {
  public name: CardName = CardName.CABIN_IN_THE_WOODS;
  public description: string = 'Awarded at Game\'s end to the player with the most greenery cubes adjacent to one of their cities.'
  public getScore(player: Player): number {
    const board = player.game.board;
    return Math.max(...board.spaces.map((space) => {
      if (space.tile?.tileType === TileType.CITY && space.player === player) {
        board.getAdjacentSpaces(space).filter((s) => s.tile?.tileType === TileType.GREENERY).length;
      }
      return 0;
    }));
  }
}
