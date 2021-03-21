import {Player} from '../Player';
import {SelectSpace} from '../inputs/SelectSpace';
import {ISpace} from '../boards/ISpace';
import {DeferredAction, Priority} from './DeferredAction';

export class PlaceGreeneryCube implements DeferredAction {
  public priority = Priority.DEFAULT;
  constructor(
    public player: Player,
    private options?: {spaces?: Array<ISpace>, title?: string},
  ) {}

  public execute() {
    const availableSpaces = this.options?.spaces || this.player.game.board.getAvailableSpacesOnLand();
    if (availableSpaces.length === 0) {
      return undefined;
    }

    return new SelectSpace(
      this.options?.title || 'Select space for greenery cube',
      availableSpaces,
      (space: ISpace) => {
        this.player.game.addGreenery(this.player, space.id);
        return undefined;
      },
    );
  }
}
