import {Player} from '../Player';
import {SelectSpace} from '../inputs/SelectSpace';
import {ISpace} from '../boards/ISpace';
import {SpaceType} from '../SpaceType';
import {DeferredAction, Priority} from './DeferredAction';

export class PlaceWaterCube implements DeferredAction {
  public priority = Priority.PLACE_WATER_CUBE;
  constructor(
        public player: Player,
        private options?: {
          title?: string,
          optional?: boolean,
        },
  ) {}

  public execute() {
    if (this.player.game.waterCubes === 0) {
      return undefined;
    }

    // TODO(kberg): make optional.
    return new SelectSpace(
      this.options?.title || 'Select space for water cube',
      this.player.game.board.getAvailableSpacesForWaterCubes(),
      (space: ISpace) => {
        this.player.game.addWaterCube(this.player, space.id, SpaceType.WATER);
        return undefined;
      },
    );
  }
}
