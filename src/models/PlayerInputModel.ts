
import {PlayerInputTypes} from '../PlayerInputTypes';
import {CardModel} from './CardModel';
import {ColorWithNeutral} from '../Color';
import {Message} from '../Message';

export interface PlayerInputModel {
    amount: number | undefined;
    availableSpaces: Array<string> | undefined;
    cards: Array<CardModel> | undefined;
    inputType: PlayerInputTypes;
    options: Array<PlayerInputModel> | undefined;
    min: number | undefined;
    max: number | undefined;
    maxCardsToSelect: number | undefined;
    minCardsToSelect: number | undefined;
    players: Array<ColorWithNeutral> | undefined;
    title: string | Message;
    buttonLabel: string;
    showOnlyInLearnerMode?: boolean;
    showOwner?: boolean;
}
