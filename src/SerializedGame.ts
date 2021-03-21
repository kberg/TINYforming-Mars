import {Phase} from './Phase';
import {SerializedClaimedMilestone} from './milestones/ClaimedMilestone';
import {SerializedFundedAward} from './awards/FundedAward';
import {IMilestone} from './milestones/IMilestone';
import {IAward} from './awards/IAward';
import {DeferredAction} from './deferredActions/DeferredAction';
import {SerializedPlayer} from './SerializedPlayer';
import {SerializedDealer} from './SerializedDealer';
import {PlayerId} from './Player';
import {GameId, GameOptions, SpectatorId} from './Game';
import {LogMessage} from './LogMessage';
import {SerializedBoard} from './boards/SerializedBoard';

export interface SerializedGame {
    activePlayer: PlayerId;
    awards: Array<IAward>;
    board: SerializedBoard;
    claimedMilestones: Array<SerializedClaimedMilestone>;
    clonedGamedId?: string;
    dealer: SerializedDealer;
    deferredActions: Array<DeferredAction>;
    donePlayers: Array<PlayerId>;
    researchRound: number;
    first: SerializedPlayer | PlayerId;
    fundedAwards: Array<SerializedFundedAward>;
    gameAge: number;
    gameLog: Array<LogMessage>;
    gameOptions: GameOptions;
    generation: number;
    heatCubes: number;
    waterCubes: number;
    greeneryCubes: number;
    id: GameId;
    lastSaveId: number;
    milestones: Array<IMilestone>;
    passedPlayers: Array<PlayerId>;
    phase: Phase;
    players: Array<SerializedPlayer>;
    seed: number;
    spectatorId: SpectatorId | undefined;
    undoCount: number;
}

