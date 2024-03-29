
import {PlayerInput} from '../PlayerInput';
import {PlayerInputTypes} from '../PlayerInputTypes';
import {SelectSpace} from './SelectSpace';
import {SelectCard} from './SelectCard';
import {CorporationCard} from '../cards/corporation/CorporationCard';
import {SelectPlayer} from './SelectPlayer';
import {OrOptions} from './OrOptions';
import {SelectAmount} from './SelectAmount';
import {ICard} from '../cards/ICard';
import {IProjectCard} from '../cards/IProjectCard';

export class AndOptions implements PlayerInput {
    public inputType: PlayerInputTypes = PlayerInputTypes.AND_OPTIONS;
    public title = '';
    public buttonLabel: string = 'Save';
    public options: Array<PlayerInput>;
    constructor(public cb: () => PlayerInput | undefined, ...options: Array<OrOptions | SelectAmount | SelectPlayer | SelectSpace | SelectCard<CorporationCard> | SelectCard<ICard> | SelectCard<IProjectCard>>) {
      this.options = options;
    }
}
