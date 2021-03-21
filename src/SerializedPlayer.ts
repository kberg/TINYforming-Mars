import {PlayerId} from './Player';
import {CardName} from './CardName';
import {Color} from './Color';
import {SerializedCard} from './SerializedCard';
import {VictoryPointsBreakdown} from './VictoryPointsBreakdown';
import {SerializedTimer} from './SerializedTimer';

export interface SerializedPlayer {
    actionsThisGeneration: Array<CardName>;
    beginner: boolean;
    cardsInHand: Array<CardName>;
    color: Color;
    corporationCard: SerializedCard | undefined;
    corporationInitialActionDone: boolean;
    credits: number;
    dealtCorporationCards: Array<CardName>;
    dealtProjectCards: Array<CardName>;
    draftedCards: Array<CardName>;
    heat: number;
    id: PlayerId;
    lastCardPlayed?: CardName;
    name: string;
    needsToDraft: boolean | undefined;
    pickedCards: Array<CardName | undefined> | undefined;
    playedCards: Array<SerializedCard>;
    timer: SerializedTimer;
    victoryPointsBreakdown: VictoryPointsBreakdown;
}
