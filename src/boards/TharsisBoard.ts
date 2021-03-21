import {Board} from './Board';
import {Player} from '../Player';
import {BoardBuilder} from './BoardBuilder';
import {SerializedBoard} from './SerializedBoard';
import {Random} from '../Random';
import {Tag} from '../cards/Tag';

export class TharsisBoard extends Board {
  public static newInstance(shuffle: boolean, rng: Random): TharsisBoard {
    const builder = new BoardBuilder();

    const PRODUCTION = Tag.PRODUCTION;
    const ENERGY = Tag.ENERGY;
    const NATURE = Tag.NATURE;
    const SPACE = Tag.SPACE;

    // y=0
    builder.land(PRODUCTION).land().water(ENERGY);
    // y=1
    builder.land().land().land().land();
    // y=2
    builder.land(NATURE).water(NATURE).water(NATURE).land().land(NATURE);
    // y=3
    builder.land().land().water(NATURE).water();
    // y=4
    builder.land(PRODUCTION).land().land(SPACE);

    if (shuffle) {
      builder.shuffle(rng);
    }
    const spaces = builder.build();
    return new TharsisBoard(spaces);
  }

  public static deserialize(board: SerializedBoard, players: Array<Player>): TharsisBoard {
    return new TharsisBoard(Board.deserializeSpaces(board.spaces, players));
  }
}
