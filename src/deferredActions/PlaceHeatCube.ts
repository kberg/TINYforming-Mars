import {Player} from '../Player';
import {SelectSpace} from '../inputs/SelectSpace';
import {ISpace} from '../boards/ISpace';
import {SpaceType} from '../SpaceType';
import {DeferredAction, Priority} from './DeferredAction';

export class PlaceHeatCube implements DeferredAction {
  public priority = Priority.PLACE_WATER_CUBE;
  constructor(
        public player: Player,
        private options?: {
          title?: string,
        },
  ) {}

  public execute() {
    if (this.player.game.waterCubes === 0) {
      return undefined;
    }

    // TODO(kberg): make optional.
    return new SelectSpace(
      this.options?.title || 'Select space for Heat Cube',
      this.player.game.board.getAvailableSpacesOnLand(),
      (space: ISpace) => {
        this.player.game.addWaterCube(this.player, space.id, SpaceType.WATER);
        return undefined;
      },
    );
  }
}
