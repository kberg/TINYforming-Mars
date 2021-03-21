import * as constants from './constants';
import {Board} from './boards/Board';
import {BoardName} from './boards/BoardName';
import {CardType} from './cards/CardType';
import {ClaimedMilestone, serializeClaimedMilestones, deserializeClaimedMilestones} from './milestones/ClaimedMilestone';
import {Color} from './Color';
import {CorporationCard} from './cards/corporation/CorporationCard';
import {Database} from './database/Database';
import {Dealer} from './Dealer';
import {ElysiumBoard} from './boards/ElysiumBoard';
import {FundedAward, serializeFundedAwards, deserializeFundedAwards} from './awards/FundedAward';
import {HellasBoard} from './boards/HellasBoard';
import {IAward} from './awards/IAward';
import {ISerializable} from './ISerializable';
import {IMilestone} from './milestones/IMilestone';
import {IProjectCard} from './cards/IProjectCard';
import {ISpace, SpaceId} from './boards/ISpace';
import {ITile} from './ITile';
import {LogBuilder} from './LogBuilder';
import {LogHelper} from './LogHelper';
import {LogMessage} from './LogMessage';
import {TharsisBoard} from './boards/TharsisBoard';
import {Phase} from './Phase';
import {Player, PlayerId} from './Player';
import {PlayerInput} from './PlayerInput';
import {DeferredAction, Priority} from './deferredActions/DeferredAction';
import {DeferredActionsQueue} from './deferredActions/DeferredActionsQueue';
import {SerializedGame} from './SerializedGame';
import {SerializedPlayer} from './SerializedPlayer';
import {SpaceType} from './SpaceType';
import {TileType} from './TileType';
import {GameSetup} from './GameSetup';
import {GlobalParameter} from './GlobalParameter';
import {Random} from './Random';
import {BoardType} from './boards/BoardType';
import {Milestones} from './milestones/Milestones';
import {Awards} from './awards/Awards';
import {INITIAL_HEAT_CUBES} from './constants';
import {Tag} from './cards/Tag';
import {Multiset} from './utils/Multiset';
import {AndOptions} from './inputs/AndOptions';
import {SelectCard} from './inputs/SelectCard';
import {PlaceCityTile} from './deferredActions/PlaceCityTile';

export type GameId = string;
export type SpectatorId = string;

export interface Score {
  corporation: String;
  playerScore: number;
}

export interface GameOptions {
  boardName: BoardName;
  clonedGamedId: GameId | undefined;

  // Configuration
  undoOption: boolean;
  shuffleMap: boolean;
  corporations: boolean;
  milestones: boolean;
  awards: boolean;
}

const DEFAULT_GAME_OPTIONS: GameOptions = {
  boardName: BoardName.THARSIS,
  clonedGamedId: undefined,
  undoOption: false,
  shuffleMap: false,
  corporations: true,
  milestones: true,
  awards: true,
};

export class Game implements ISerializable<SerializedGame> {
  // Game-level data
  public lastSaveId: number = 0;
  private clonedGamedId: string | undefined;
  public seed: number;
  public spectatorId: SpectatorId | undefined;
  public deferredActions: DeferredActionsQueue = new DeferredActionsQueue();
  public gameAge: number = 0; // Each log event increases it
  public gameLog: Array<LogMessage> = [];
  public undoCount: number = 0; // Each undo increases it

  public generation: number = 1;
  public phase: Phase = Phase.RESEARCH;
  public dealer: Dealer;
  public board: Board;

  // General supply
  public heatCubes: number = INITIAL_HEAT_CUBES;
  public greeneryCubes: number = constants.INITIAL_GREENERIES;
  public waterCubes: number = constants.INITIAL_WATER_CUBES;
  public resourceTagTokens: Multiset<Tag> = new Multiset([Tag.NATURE, Tag.NATURE, Tag.PRODUCTION, Tag.SCIENCE]);

  // Player data
  public activePlayer: PlayerId;
  private donePlayers = new Set<PlayerId>();
  private passedPlayers = new Set<PlayerId>();

  // Research
  private researchRound: number = 1;

  // Milestones and awards
  public claimedMilestones: Array<ClaimedMilestone> = [];
  public milestones: Array<IMilestone> = [];
  public fundedAwards: Array<FundedAward> = [];
  public awards: Array<IAward> = [];

  private constructor(
    public id: GameId,
    private players: Array<Player>,
    private first: Player,
    activePlayer: PlayerId,
    public gameOptions: GameOptions,
    seed: number,
    board: Board,
    dealer: Dealer) {
    const playerIds = players.map((p) => p.id);
    if (playerIds.includes(first.id) === false) {
      throw new Error('Cannot find first player ' + first.id + ' in ' + playerIds);
    }
    if (playerIds.includes(activePlayer) === false) {
      throw new Error('Cannot find active player ' + activePlayer + ' in ' + playerIds);
    }
    if (new Set(playerIds).size !== players.length) {
      throw new Error('Duplicate player found: ' + playerIds);
    }
    const colors = players.map((p) => p.color);
    if (new Set(colors).size !== players.length) {
      throw new Error('Duplicate color found: ' + colors);
    }

    this.activePlayer = activePlayer;
    this.seed = seed;
    this.dealer = dealer;
    this.board = board;

    this.players.forEach((player) => {
      player.game = this;
    });
  }

  public static newInstance(id: GameId,
    players: Array<Player>,
    firstPlayer: Player,
    gameOptions: GameOptions = {...DEFAULT_GAME_OPTIONS},
    seed: number = 0,
    spectatorId: SpectatorId | undefined = undefined): Game {
    if (gameOptions.clonedGamedId !== undefined) {
      throw new Error('Cloning should not come through this execution path.');
    }

    const rng = new Random(seed);
    const board = GameSetup.newBoard(gameOptions.boardName, gameOptions.shuffleMap, rng);
    const dealer = Dealer.newInstance();

    const activePlayer = firstPlayer.id;

    const game = new Game(id, players, firstPlayer, activePlayer, gameOptions, seed, board, dealer);
    game.spectatorId = spectatorId;

    // and 2 neutral cities and forests on board
    if (players.length === 1) {
      //  Setup solo player's starting tiles
      GameSetup.setupNeutralPlayer(game);
    }

    // Print game_id if solo game
    if (players.length === 1) {
      game.log('The id of this game is ${0}', (b) => b.rawString(id));
    }

    game.log('Generation ${0}', (b) => b.forNewGeneration().number(game.generation));

    if (gameOptions.corporations || gameOptions.awards || gameOptions.milestones) {
      game.gotoSetupExpansionsPhase();
    } else {
      game.gotoChooseStartingCitiesPhase();
    }

    return game;
  }

  public save(): void {
    Database.getInstance().saveGame(this);
  }

  public toJSON(): string {
    return JSON.stringify(this.serialize());
  }

  public serialize(): SerializedGame {
    const result: SerializedGame = {
      activePlayer: this.activePlayer,
      awards: this.awards,
      board: this.board.serialize(),
      claimedMilestones: serializeClaimedMilestones(this.claimedMilestones),
      dealer: this.dealer.serialize(),
      deferredActions: [],
      donePlayers: Array.from(this.donePlayers),
      researchRound: this.researchRound,
      first: this.first.id,
      fundedAwards: serializeFundedAwards(this.fundedAwards),
      heatCubes: this.heatCubes,
      waterCubes: this.waterCubes,
      greeneryCubes: this.greeneryCubes,
      gameAge: this.gameAge,
      gameLog: this.gameLog,
      gameOptions: this.gameOptions,
      generation: this.generation,
      id: this.id,
      lastSaveId: this.lastSaveId,
      milestones: this.milestones,
      passedPlayers: Array.from(this.passedPlayers),
      phase: this.phase,
      players: this.players.map((p) => p.serialize()),
      seed: this.seed,
      spectatorId: this.spectatorId,
      undoCount: this.undoCount,
    };
    if (this.clonedGamedId !== undefined) {
      result.clonedGamedId = this.clonedGamedId;
    }
    return result;
  }

  public isSoloMode() :boolean {
    return this.players.length === 1;
  }

  // Function to retrieve a player by it's id
  public getPlayerById(id: string): Player {
    const player = this.players.find((p) => p.id === id);
    if (player === undefined) {
      throw new Error(`player ${id} does not exist on game ${this.id}`);
    }
    return player;
  }

  // Function to return an array of players from an array of player ids
  public getPlayersById(ids: Array<string>): Array<Player> {
    return ids.map((id) => this.getPlayerById(id));
  }

  public defer(action: DeferredAction, priority?: Priority | number): void {
    if (priority !== undefined) {
      action.priority = priority;
    }
    this.deferredActions.push(action);
  }

  public run(action: DeferredAction, cb: () => void): void {
    this.deferredActions.run(action, cb);
  }

  public milestoneClaimed(milestone: IMilestone): boolean {
    return this.claimedMilestones.find(
      (claimedMilestone) => claimedMilestone.milestone === milestone,
    ) !== undefined;
  }

  public marsIsTerraformed(): boolean {
    return this.heatCubes === 0 && this.greeneryCubes === 0 && this.waterCubes === 0;
  }

  public lastSoloGeneration(): number {
    return 12;
  }

  public isSoloModeWin(): boolean {
    // Solo TR victory condition
    // Complete terraforing victory condition.
    if (!this.marsIsTerraformed()) {
      return false;
    }

    // This last conditional doesn't make much sense to me. It's only ever really used
    // on the client at components/GameEnd.ts. Which is probably why it doesn't make
    // obvious sense why when this generation is earlier than the last generation
    // of the game means "true, is solo mode win."
    return this.generation <= this.lastSoloGeneration();
  }

  public fundAward(player: Player, award: IAward): void {
    if (this.allMAsClaimed()) {
      throw new Error('All awards already funded');
    }
    this.log('${0} funded ${1} award',
      (b) => b.player(player).award(award));

    this.fundedAwards.push({
      award: award,
      player: player,
    });
  }

  public hasBeenFunded(award: IAward): boolean {
    return this.fundedAwards.find(
      (fundedAward) => fundedAward.award === award,
    ) !== undefined;
  }

  public claimedMACount(): number {
    return this.claimedMilestones.length + this.fundedAwards.length;
  }

  public allMAsClaimed(): boolean {
    // Milestones are disabled for 1 player games
    if (this.players.length === 1) return true;

    return this.claimedMACount() >= constants.MAX_MAS;
  }

  private playCorporationCard(
    player: Player, corporationCard: CorporationCard,
  ): void {
    player.corporationCard = corporationCard;
    player.credits = corporationCard.startingCredits;

    corporationCard.play(player);
    this.log('${0} played ${1}', (b) => b.player(player).card(corporationCard));

    // trigger other corp's effect, e.g. SaturnSystems,PharmacyUnion,Splice
    for (const somePlayer of this.getPlayers()) {
      if (somePlayer !== player && somePlayer.corporationCard !== undefined && somePlayer.corporationCard.onCorpCardPlayed !== undefined) {
        this.defer(new DeferredAction(
          player,
          () => {
            if (somePlayer.corporationCard !== undefined && somePlayer.corporationCard.onCorpCardPlayed !== undefined) {
              return somePlayer.corporationCard.onCorpCardPlayed(player, corporationCard) || undefined;
            }
            return undefined;
          },
        ));
      }
    }
  }

  private pickExpansionCards(player: Player): PlayerInput {
    let corp: CorporationCard;
    let award: IAward;
    let milestone: IMilestone;

    const and = new AndOptions(() => {
      player.pickedCards = {corp, award, milestone};

      // if all players have completed the initial setup phase
      if (this.players.every((p) => p.pickedCards !== undefined)) {
        this.players.forEach((p) => {
          if (p.pickedCards === undefined) {
            throw new Error('illegal state: pickedcards is undefined');
          }
          if (p.pickedCards.corp) {
            this.playCorporationCard(p, p.pickedCards.corp);
          }
          if (p.pickedCards.award) {
            this.awards.push(p.pickedCards.award);
          }
          if (p.pickedCards.milestone) {
            this.milestones.push(p.pickedCards.milestone);
          }
        });
        this.save();
        this.gotoChooseStartingCitiesPhase();
      }

      return undefined;
    });

    if (player.dealtCorporationCards.length > 0) {
      and.options.push(
        new SelectCard<CorporationCard>(
          'Select one corporation', undefined, player.dealtCorporationCards,
          (selected: Array<CorporationCard>) => {
            corp = selected[0];
            return undefined;
          },
        ),
      );
    }

    if (player.dealtAwards.length > 0) {
      and.options.push(
        new SelectCard<IAward>(
          'Select one award', undefined, player.dealtAwards,
          (selected: Array<IAward>) => {
            award = selected[0];
            return undefined;
          },
        ),
      );
    }

    if (player.dealtMilestones.length > 0) {
      and.options.push(
        new SelectCard<IMilestone>(
          'Select one milestone', undefined, player.dealtMilestones,
          (selected: Array<IMilestone>) => {
            milestone = selected[0];
            return undefined;
          },
        ),
      );
    }

    return and;
  }

  public hasPassedThisActionPhase(player: Player): boolean {
    return this.passedPlayers.has(player.id);
  }

  private incrementFirstPlayer(): void {
    const firstId = this.first.id === this.players[0].id ? 1 : 0;
    this.first = this.players[firstId];
  }

  private gotoSetupExpansionsPhase(): void {
    this.phase = Phase.SETUP_EXPANSIONS;
    this.save();

    function dealCard<T>(deck: Array<T>, destination: Array<T>) {
      const card = deck.pop();
      if (card === undefined) {
        throw new Error();
      }
      destination.push(card);
    }

    this.players.forEach((player) => {
      if (this.gameOptions.corporations) {
        dealCard(this.dealer.corporationCards, player.dealtCorporationCards);
        dealCard(this.dealer.corporationCards, player.dealtCorporationCards);
      }
      if (this.gameOptions.awards) {
        dealCard(this.dealer.awards, player.dealtAwards);
        dealCard(this.dealer.awards, player.dealtAwards);
      }
      if (this.gameOptions.milestones) {
        dealCard(this.dealer.milestones, player.dealtMilestones);
        dealCard(this.dealer.milestones, player.dealtMilestones);
      }
    });

    this.players.forEach((player) => {
      if (player.pickedCards === undefined && player.dealtCorporationCards.length > 0) {
        player.setWaitingFor(this.pickExpansionCards(player), () => {});
      }
    });
  }

  private gotoChooseStartingCitiesPhase(): void {
    this.phase = Phase.CHOOSE_STARTING_CITIES;
    this.run(new PlaceCityTile(this.players[1]),
      () => this.run(new PlaceCityTile(this.players[0]),
        () => this.gotoResearchPhase()));
  }

  private gotoResearchPhase(): void {
    this.phase = Phase.RESEARCH;
    this.researchRound = 1;
    this.runResearchRound();
  }

  private runResearchRound() {
    this.save();
    const player = this.researchRound === 1 ? this.getNextPlayer(this.first) : this.first;
    const c1 = this.dealer.dealCard(this);
    const c2 = this.dealer.dealCard(this);
    this.log('${0} drew ${1} and ${2}', (b) => b.player(player).card(c1).card(c2));
    this.defer(new DeferredAction(player,
      () => new SelectCard<IProjectCard>(
        'Select a project to keep.',
        'Choose',
        [c1, c2],
        (selected: Array<IProjectCard>) => {
          player.cardsInHand.push(selected[0]);
          this.getNextPlayer(player).cardsInHand.push(selected[0].name === c1.name ? c2 : c1);
          this.researchRound++;
          if (this.researchRound === 4) {
            this.gotoActionPhase();
          } else {
            this.runResearchRound();
          }
          return undefined;
        },
      )));
  }

  public gameIsOver(): boolean {
    if (this.isSoloMode()) {
      // Solo games continue until the designated generation end even if Mars is already terraformed
      return this.generation === this.lastSoloGeneration();
    }
    return this.marsIsTerraformed();
  }

  private gotoProductionPhase(): void {
    this.phase = Phase.PRODUCTION;
    this.passedPlayers.clear();
    this.players.forEach((player) => {
      player.runProductionPhase();
    });

    if (this.gameIsOver()) {
      this.gotoEndGame();
      return;
    }

    this.gotoEndGeneration();
  }

  private gotoEndGeneration() {
    this.phase = Phase.INTERGENERATION;
    this.startNextGeneration();
  }

  private startNextGeneration() {
    this.generation++;
    this.log('Generation ${0}', (b) => b.forNewGeneration().number(this.generation));
    this.incrementFirstPlayer();

    this.gotoResearchPhase();
  }

  private allPlayersHavePassed(): boolean {
    for (const player of this.players) {
      if (!this.hasPassedThisActionPhase(player)) {
        return false;
      }
    }
    return true;
  }

  public playerHasPassed(player: Player): void {
    this.passedPlayers.add(player.id);
  }

  private gotoActionPhase() {
    this.deferredActions.runAll(() => {
      this.phase = Phase.ACTION;
      this.passedPlayers.clear();
      this.startActionsForPlayer(this.first);
    });
  }

  private getNextPlayer(player: Player): Player {
    const playerIndex: number = 1 - this.players.indexOf(player);
    return this.players[playerIndex];
  }


  public playerIsFinishedTakingActions(): void {
    // Deferred actions hook
    if (this.deferredActions.length > 0) {
      this.deferredActions.runAll(() => this.playerIsFinishedTakingActions());
      return;
    }

    if (this.allPlayersHavePassed()) {
      this.gotoProductionPhase();
      return;
    }

    const nextPlayer = this.getNextPlayer(this.getPlayerById(this.activePlayer));

    // Defensive coding to fail fast, if we don't find the next
    // player we are in an unexpected game state
    if (nextPlayer === undefined) {
      throw new Error('Did not find player');
    }

    if (!this.hasPassedThisActionPhase(nextPlayer)) {
      this.startActionsForPlayer(nextPlayer);
    } else {
      // Recursively find the next player
      this.activePlayer = nextPlayer.id;
      this.playerIsFinishedTakingActions();
    }
  }

  private gotoEndGame(): void {
    // Log id or cloned game id
    if (this.clonedGamedId !== undefined && this.clonedGamedId.startsWith('#')) {
      this.log('This game was a clone from game ' + this.clonedGamedId);
    } else {
      this.log('This game id was ' + this.id);
    }

    Database.getInstance().cleanSaves(this.id, this.lastSaveId);
    const scores: Array<Score> = [];
    this.players.forEach((player) => {
      let corponame: String = '';
      if (player.corporationCard !== undefined) {
        corponame = player.corporationCard.name;
      }
      scores.push({corporation: corponame, playerScore: player.victoryPointsBreakdown.total});
    });

    Database.getInstance().saveGameResults(this.id, this.players.length, this.generation, this.gameOptions, scores);
    if (this.phase === Phase.END) return;
    this.phase = Phase.END;
  }

  public playerIsDoneWithGame(player: Player): void {
    this.donePlayers.add(player.id);
    this.gotoEndGame();
  }

  private startActionsForPlayer(player: Player) {
    this.activePlayer = player.id;
    player.takeAction();
  }

  public checkMinRequirements(parameter: GlobalParameter, level: number): boolean {
    return this.checkRequirements(parameter, level);
  }

  public checkMaxRequirements(parameter: GlobalParameter, level: number): boolean {
    return this.checkRequirements(parameter, level, true);
  }

  public checkRequirements(parameter: GlobalParameter, level: number, max: boolean = false): boolean {
    let currentLevel: number;

    switch (parameter) {
    case GlobalParameter.WATER:
      currentLevel = this.board.getWaterCubes().length;
      break;
    case GlobalParameter.GREENERIES:
      currentLevel = 1; // this.getOxygenLevel();
      break;
    case GlobalParameter.HEAT:
      currentLevel = this.heatCubes;
      break;

    default:
      console.warn(`Unknown GlobalParameter provided: ${parameter}`);
      return false;
    }

    if (max) {
      return currentLevel <= level;
    } else {
      return currentLevel >= level;
    }
  }

  public getGeneration(): number {
    return this.generation;
  }

  public getPassedPlayers():Array<Color> {
    const passedPlayersColors: Array<Color> = [];
    this.passedPlayers.forEach((player) => {
      passedPlayersColors.push(this.getPlayerById(player).color);
    });
    return passedPlayersColors;
  }

  public getPlayer(name: string): Player {
    const player = this.players.find((player) => player.name === name);
    if (player === undefined) {
      throw new Error('Player not found');
    }
    return player;
  }

  public getCitiesInPlay(): number {
    return this.board.spaces.filter((space) => Board.hasCity(space)).length;
  }
  public getSpaceCount(tileType: TileType, player: Player): number {
    return this.board.spaces.filter(
      (space) => space.tile !== undefined &&
                  space.tile.tileType === tileType &&
                  space.player !== undefined &&
                  space.player === player,
    ).length;
  }

  // addTile applies to the Mars board, but not the Moon board, see MoonExpansion.addTile for placing
  // a tile on The Moon.
  public addTile(
    player: Player, spaceType: SpaceType,
    space: ISpace, tile: ITile): void {
    // Part 1, basic validation checks.

    // Land claim a player can claim land for themselves
    if (space.player !== undefined && space.player !== player) {
      throw new Error('This space is land claimed by ' + space.player.name);
    }

    if (space.spaceType !== spaceType) {
      throw new Error(
        `Select a valid location ${space.spaceType} is not ${spaceType}`,
      );
    }

    // // Hellas special requirements ocean tile
    // if (space.id === SpaceName.HELLAS_OCEAN_TILE &&
    //     this.board.getOceansOnBoard() < constants.MAX_OCEAN_TILES &&
    //     this.gameOptions.boardName === BoardName.HELLAS) {
    //   if (player.color !== Color.NEUTRAL) {
    //     this.defer(new PlaceOceanTile(player, 'Select space for ocean from placement bonus'));
    //     this.defer(new SelectHowToPayDeferred(player, 6, {title: 'Select how to pay for placement bonus ocean'}));
    //   }
    // }

    // Part 3. Setup for bonuses
    // Part 4. Place the tile
    this.simpleAddTile(player, space, tile);
    player.cubesPlacedThisGeneration.add(tile.tileType);

    // Part 5. Collect the bonuses
    // space.bonus.forEach((spaceBonus) => {
    //   this.grantSpaceBonus(player, spaceBonus);
    // });

    this.players.forEach((p) => {
      p.corporationCard?.onTilePlaced?.(p, player, space, BoardType.MARS);
    });
  }

  public simpleAddTile(player: Player, space: ISpace, tile: ITile) {
    space.tile = tile;
    space.player = tile.tileType === TileType.CITY ? player : undefined;
    LogHelper.logTilePlacement(player, space, tile.tileType);
  }

  public addGreenery(
    player: Player, spaceId: SpaceId,
    spaceType: SpaceType = SpaceType.LAND): undefined {
    this.addTile(player, spaceType, this.board.getSpace(spaceId), {
      tileType: TileType.GREENERY,
    });
    return undefined;
  }

  public addCityTile(
    player: Player, spaceId: SpaceId, spaceType: SpaceType = SpaceType.LAND): void {
    const space = this.board.getSpace(spaceId);
    this.addTile(player, spaceType, space, {
      tileType: TileType.CITY,
    });
  }

  public addWaterCube(
    player: Player, spaceId: SpaceId,
    spaceType: SpaceType = SpaceType.WATER): void {
    if (this.waterCubes === 0) {
      return;
    }
    this.addTile(player, spaceType, this.board.getSpace(spaceId), {
      tileType: TileType.WATER,
    });
  }

  public removeCube(spaceId: string): void {
    const space = this.board.getSpace(spaceId);
    space.tile = undefined;
    space.player = undefined;
  }

  public getPlayers(): Array<Player> {
    // We always return them in turn order
    const ret: Array<Player> = [];
    let insertIdx: number = 0;
    for (const p of this.players) {
      if (p.id === this.first.id || insertIdx > 0) {
        ret.splice(insertIdx, 0, p);
        insertIdx ++;
      } else {
        ret.push(p);
      }
    }
    return ret;
  }

  public getCardPlayer(name: string): Player {
    for (const player of this.players) {
      // Check cards player has played
      for (const card of player.playedCards) {
        if (card.name === name) {
          return player;
        }
      }
      // Check player corporation
      if (player.corporationCard !== undefined && player.corporationCard.name === name) {
        return player;
      }
    }
    throw new Error('No player has played requested card');
  }
  public getCard(name: string): IProjectCard | undefined {
    for (let i = 0; i < this.players.length; i++) {
      for (let j = 0; j < this.players[i].playedCards.length; j++) {
        if (this.players[i].playedCards[j].name === name) {
          return this.players[i].playedCards[j];
        }
      }
    }
    return undefined;
  }

  public getCardsInHandByType(player: Player, cardType: CardType) {
    return player.cardsInHand.filter((card) => card.cardType === cardType);
  }

  public log(message: string, f?: (builder: LogBuilder) => void) {
    const builder = new LogBuilder(message);
    if (f) {
      f(builder);
    }
    this.gameLog.push(builder.logMessage());
    this.gameAge++;
  }

  public discardForCost(toPlace: TileType) {
    const card = this.dealer.dealCard(this);
    this.dealer.discard(card);
    this.log('Drew and discarded ${0} (cost ${1}) to place a ${2}', (b) => b.card(card).number(card.cost!).tileType(toPlace));
    return card.cost;
  }

  public getSpaceByOffset(direction: -1 | 1, toPlace: TileType) {
    const cost = this.discardForCost(toPlace)!;

    const distance = Math.max(cost-1, 0); // Some cards cost zero.
    const space = this.board.getNthAvailableLandSpace(distance, direction, undefined /* player */,
      (space) => {
        const adjacentSpaces = this.board.getAdjacentSpaces(space);
        return adjacentSpaces.filter((sp) => sp.tile?.tileType === TileType.CITY).length === 0 && // no cities nearby
            adjacentSpaces.find((sp) => this.board.canPlaceTile(sp)) !== undefined; // can place forest nearby
      });
    if (space === undefined) {
      throw new Error('Couldn\'t find space when card cost is ' + cost);
    }
    return space;
  }

  public static deserialize(d: SerializedGame): Game {
    const gameOptions = d.gameOptions;

    const players = d.players.map((element: SerializedPlayer) => Player.deserialize(element));
    const first = players.find((player) => player.id === d.first);
    if (first === undefined) {
      throw new Error(`Player ${d.first} not found when rebuilding First Player`);
    }

    const playersForBoard = players.length !== 1 ? players : [players[0], GameSetup.neutralPlayerFor(d.id)];
    let board;
    if (gameOptions.boardName === BoardName.ELYSIUM) {
      board = ElysiumBoard.deserialize(d.board, playersForBoard);
    } else if (gameOptions.boardName === BoardName.HELLAS) {
      board = HellasBoard.deserialize(d.board, playersForBoard);
    } else {
      board = TharsisBoard.deserialize(d.board, playersForBoard);
    }

    // Rebuild dealer object to be sure that we will have cards in the same order
    const dealer = Dealer.deserialize(d.dealer);
    const game = new Game(d.id, players, first, d.activePlayer, gameOptions, d.seed, board, dealer);
    game.spectatorId = d.spectatorId;

    const milestones: Array<IMilestone> = [];
    d.milestones.forEach((element: IMilestone) => {
      Milestones.ALL.forEach((ms: IMilestone) => {
        if (ms.name === element.name) {
          milestones.push(ms);
        }
      });
    });

    game.milestones = milestones;
    game.claimedMilestones = deserializeClaimedMilestones(d.claimedMilestones, players, milestones);

    const awards: Array<IAward> = [];
    d.awards.forEach((element: IAward) => {
      Awards.ALL.forEach((award: IAward) => {
        if (award.name === element.name) {
          awards.push(award);
        }
      });
    });

    game.awards = awards;
    game.fundedAwards = deserializeFundedAwards(d.fundedAwards, players, awards);

    game.passedPlayers = new Set<PlayerId>(d.passedPlayers);
    game.donePlayers = new Set<PlayerId>(d.donePlayers);

    game.lastSaveId = d.lastSaveId;
    game.clonedGamedId = d.clonedGamedId;
    game.gameAge = d.gameAge;
    game.gameLog = d.gameLog;
    game.generation = d.generation;
    game.phase = d.phase;
    game.undoCount = d.undoCount ?? 0;
    game.activePlayer = d.activePlayer;
    game.researchRound = d.researchRound;

    // Still in Draft or Research of generation 1
    switch (game.phase) {
    case Phase.SETUP_EXPANSIONS:
      game.gotoSetupExpansionsPhase();
      break;
    case Phase.CHOOSE_STARTING_CITIES:
      game.gotoChooseStartingCitiesPhase();
      break;
    case Phase.RESEARCH:
      game.gotoResearchPhase();
      break;
    default:
      // We should be in ACTION phase, let's prompt the active player for actions
      game.getPlayerById(game.activePlayer).takeAction();
    }

    return game;
  }
}
