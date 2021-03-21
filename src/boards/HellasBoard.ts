import {Board} from './Board';
import {Player} from '../Player';
import {BoardBuilder} from './BoardBuilder';
import {SerializedBoard} from './SerializedBoard';
import {Random} from '../Random';
import {Tag} from '../cards/Tag';

export class HellasBoard extends Board {
  public static newInstance(shuffle: boolean, rng: Random): HellasBoard {
    const builder = new BoardBuilder();

    const PRODUCTION = Tag.PRODUCTION;
    const ENERGY = Tag.ENERGY;
    const NATURE = Tag.NATURE;
    const SPACE = Tag.SPACE;

    // y=0
    builder.land(NATURE).land().land();
    // y=1
    builder.water(NATURE).land(PRODUCTION).water(NATURE).land(NATURE);
    // y=2
    builder.land().land().water(ENERGY).water(NATURE).land();
    // y=3
    builder.land().land().water().land(SPACE);
    // y=4
    builder.land().land(/* HELLAS */).land();

    if (shuffle) {
      builder.shuffle(rng);
    }
    const spaces = builder.build();
    return new HellasBoard(spaces);
  }

  public static deserialize(board: SerializedBoard, players: Array<Player>): HellasBoard {
    return new HellasBoard(Board.deserializeSpaces(board.spaces, players));
  }
}
