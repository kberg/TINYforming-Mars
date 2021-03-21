import {CardModel} from './CardModel';
import {GameOptionsModel} from './GameOptionsModel';
import {Color} from '../Color';
import {VictoryPointsBreakdown} from '../VictoryPointsBreakdown';
import {ITagCount} from '../ITagCount';
import {ClaimedMilestoneModel} from './ClaimedMilestoneModel';
import {FundedAwardModel} from './FundedAwardModel';
import {Phase} from '../Phase';
import {PlayerInputModel} from './PlayerInputModel';
import {SpaceModel} from './SpaceModel';
import {SerializedTimer} from '../SerializedTimer';

export interface PlayerModel {
    actionsThisGeneration: Array<string>;
    awards: Array<FundedAwardModel>;
    cardCost: number;
    cardsInHand: Array<CardModel>;
    cardsInHandNbr: number;
    citiesCount: number;
    color: Color;
    corporationCard: CardModel | undefined;
    dealtCorporationCards: Array<CardModel>;
    dealtProjectCards: Array<CardModel>;
    deckSize: number;
    draftedCards: Array<CardModel>;
    gameAge: number;
    gameOptions: GameOptionsModel;
    generation: number;
    credits: number;
    heatCubes: number;
    id: string; // PlayerId
    isActive: boolean;
    isSoloModeWin: boolean;
    lastSoloGeneration: number,
    milestones: Array<ClaimedMilestoneModel>;
    name: string;
    waterCubes: number;
    greeneryCubes: number;
    passedPlayers: Array<Color>;
    phase: Phase;
    pickedCards: Array<CardModel>;
    playedCards: Array<CardModel>;
    players: Array<PlayerModel>;
    spaces: Array<SpaceModel>;
    spectatorId?: string;
    tags: Array<ITagCount>;
    timer: SerializedTimer;
    undoCount: number;
    victoryPointsBreakdown: VictoryPointsBreakdown;
    waitingFor: PlayerInputModel | undefined;
}
