import {Player} from '../Player';
import {SelectSpace} from '../inputs/SelectSpace';
import {ISpace} from '../boards/ISpace';
import {DeferredAction, Priority} from './DeferredAction';

export class PlaceCityTile implements DeferredAction {
  public priority = Priority.DEFAULT;
  constructor(
        public player: Player,
        private options?: {
          title?: string,
          spaces?: Array<ISpace>,
          andThen?: () => void;
        },
  ) {}

  public execute() {
    const spaces = this.options?.spaces || this.player.game.board.getAvailableSpacesForCity();
    if (spaces.length === 0) {
      return undefined;
    }
    return new SelectSpace(
      this.options?.title || 'Select space for city tile',
      spaces,
      (space: ISpace) => {
        this.player.game.addCityTile(this.player, space.id);
        if (this.options?.andThen) {
          this.options.andThen();
        }
        return undefined;
      },
    );
  }
}
