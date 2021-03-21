import {Board} from './Board';
import {BoardBuilder} from './BoardBuilder';
import {SerializedBoard} from './SerializedBoard';
import {Player} from '../Player';
import {Random} from '../Random';
import {Tag} from '../cards/Tag';

export class ElysiumBoard extends Board {
  public static newInstance(shuffle: boolean, rng: Random): ElysiumBoard {
    const builder = new BoardBuilder();

    const PRODUCTION = Tag.PRODUCTION;
    const ENERGY = Tag.ENERGY;
    const NATURE = Tag.NATURE;
    const SPACE = Tag.SPACE;

    // y=0
    builder.land(ENERGY).water(PRODUCTION).land();
    // y=1
    builder.land(SPACE).land().water().land(ENERGY);
    // y=2
    builder.land().water(NATURE).land(NATURE).water(NATURE).land();
    // y=3
    builder.land().land().land().land();
    // y=4
    builder.land(PRODUCTION).land().land(PRODUCTION);

    if (shuffle) {
      builder.shuffle(rng);
    }
    const spaces = builder.build();
    return new ElysiumBoard(spaces);
  }

  public static deserialize(board: SerializedBoard, players: Array<Player>): ElysiumBoard {
    return new ElysiumBoard(Board.deserializeSpaces(board.spaces, players));
  }
}
