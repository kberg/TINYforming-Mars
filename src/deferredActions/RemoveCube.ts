import {Player} from '../Player';
import {SelectSpace} from '../inputs/SelectSpace';
import {ISpace} from '../boards/ISpace';
import {DeferredAction, Priority} from './DeferredAction';

export class RemoveCube implements DeferredAction {
  public priority = Priority.DEFAULT;
  constructor(
    public player: Player,
    private options?: {spaces?: Array<ISpace>, title?: string},
  ) {}

  public execute() {
    const spaces = this.options?.spaces || this.player.game.board.getAvailableSpacesOnLand();
    if (spaces.length === 0) {
      return undefined;
    }

    return new SelectSpace(
      this.options?.title || 'Select space to remove that cube',
      spaces,
      (space: ISpace) => {
        this.player.game.removeCube(space.id);
        return undefined;
      },
    );
  }
}
