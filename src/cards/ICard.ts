import {CardType} from './CardType';
import {AndOptions} from '../inputs/AndOptions';
import {IProjectCard} from './IProjectCard';
import {Message} from '../Message';
import {PlayerInput} from '../PlayerInput';
import {Player} from '../Player';
import {Tag} from './Tag';
import {SelectAmount} from '../inputs/SelectAmount';
import {SelectCard} from '../inputs/SelectCard';
import {SelectPlayer} from '../inputs/SelectPlayer';
import {SelectSpace} from '../inputs/SelectSpace';
import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import {CardName} from '../CardName';
import {CardMetadata} from './CardMetadata';
import {StandardProjectCard} from './StandardProjectCard';
import {CardRequirements} from './CardRequirements';

export type CardColor = 'red' | 'green' | 'blue' | 'grey';

export interface IActionCard {
    action: (player: Player) => OrOptions | SelectOption | AndOptions | SelectAmount | SelectCard<ICard> | SelectCard<IProjectCard> | SelectPlayer | SelectSpace | undefined;
    canAct: (player: Player) => boolean;
}

export interface ICard {
    name: CardName;
    tags: Array<Tag>;
    color: CardColor;
    play: (player: Player) => PlayerInput | undefined;
    action?: (player: Player) => OrOptions | SelectOption | AndOptions | SelectAmount | SelectCard<ICard> | SelectCard<IProjectCard> | SelectPlayer | SelectSpace | undefined;
    canAct?: (player: Player) => boolean;
    getCardDiscount?: (player: Player, card: IProjectCard) => number;
    getRequirementBonus?: (player: Player) => number;
    onCardPlayed?: (player: Player, card: IProjectCard) => OrOptions | void;
    onStandardProject?: (player: Player, projectType: StandardProjectCard) => void;
    onDiscard?: (player: Player) => void;
    cost?: number;
    adjustedCost?: ((player: Player) => Number);
    cardType: CardType;
    requirements?: CardRequirements;
    metadata: CardMetadata;
    warning?: string | Message;
}

