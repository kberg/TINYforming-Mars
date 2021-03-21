import {AndOptions} from './inputs/AndOptions';
import {Board} from './boards/Board';
import {CardFinder} from './CardFinder';
import {CardName} from './CardName';
import {Color} from './Color';
import {CorporationCard} from './cards/corporation/CorporationCard';
import {Game} from './Game';
import {IAward} from './awards/IAward';
import {ICard} from './cards/ICard';
import {ISerializable} from './ISerializable';
import {IMilestone} from './milestones/IMilestone';
import {IProjectCard} from './cards/IProjectCard';
import {ITagCount} from './ITagCount';
import {LogMessageDataType} from './LogMessageDataType';
import {OrOptions} from './inputs/OrOptions';
import {Phase} from './Phase';
import {PlayerInput} from './PlayerInput';
import {SelectAmount} from './inputs/SelectAmount';
import {SelectCard} from './inputs/SelectCard';
import {DeferredAction} from './deferredActions/DeferredAction';
import {SelectOption} from './inputs/SelectOption';
import {SelectPlayer} from './inputs/SelectPlayer';
import {SelectSpace} from './inputs/SelectSpace';
import {SerializedCard} from './SerializedCard';
import {SerializedPlayer} from './SerializedPlayer';
import {Tag} from './cards/Tag';
import {TileType} from './TileType';
import {VictoryPointsBreakdown} from './VictoryPointsBreakdown';
import {Timer} from './Timer';
import {DrawCards} from './deferredActions/DrawCards';
import {StandardProjectCard} from './cards/StandardProjectCard';
import {Multiset} from './utils/Multiset';
import {MANIFEST} from './cards/Cards';

export type PlayerId = string;

export class Player implements ISerializable<SerializedPlayer> {
  public readonly id: PlayerId;
  private waitingFor?: PlayerInput;
  private waitingForCb?: () => void;
  private _game: Game | undefined = undefined;

  // Corporate identity
  public corporationCard: CorporationCard | undefined = undefined;
  // Used only during set-up
  public pickedCards: {
    corp: CorporationCard | undefined,
    award: IAward | undefined,
    milestone: IMilestone | undefined
  } | undefined;

  // Resources
  public credits: number = 0;
  public heatCubes: number = 0;
  public resourceTagTokens: Multiset<Tag> = new Multiset();

  // This generation / this round
  private actionsThisGeneration: Set<CardName> = new Set();
  public lastCardPlayed: IProjectCard | undefined;
  private corporationInitialActionDone: boolean = false;
  public cubesPlacedThisGeneration: Set<TileType> = new Set();

  // Cards
  public dealtCorporationCards: Array<CorporationCard> = [];
  public dealtAwards: Array<IAward> = [];
  public dealtMilestones: Array<IMilestone> = [];
  public dealtProjectCards: Array<IProjectCard> = [];
  public cardsInHand: Array<IProjectCard> = [];
  public playedCards: Array<IProjectCard> = [];
  public draftedCards: Array<IProjectCard> = [];
  public needsToDraft: boolean | undefined = undefined;

  public timer: Timer = Timer.newInstance();

  public victoryPointsBreakdown = new VictoryPointsBreakdown();

  constructor(
    public name: string,
    public color: Color,
    public beginner: boolean,
    id: PlayerId) {
    this.id = id;
  }

  public static initialize(
    name: string,
    color: Color,
    beginner: boolean,
    id: PlayerId): Player {
    const player = new Player(name, color, beginner, id);
    return player;
  }

  public set game(game: Game) {
    if (this._game !== undefined) {
      // TODO(kberg): Replace this with an Error.
      console.warn(`Reinitializing game ${game.id} for player ${this.color}`);
    }
    this._game = game;
  }

  public get game(): Game {
    if (this._game === undefined) {
      throw new Error(`Fetching game for player ${this.color} too soon.`);
    }
    return this._game;
  }

  public isCorporation(corporationName: CardName): boolean {
    return this.corporationCard?.name === corporationName;
  }

  public getActionsThisGeneration(): Set<CardName> {
    return this.actionsThisGeneration;
  }

  public addActionsThisGeneration(cardName: CardName): void {
    this.actionsThisGeneration.add(cardName);
    return;
  }

  public gainHeatCube(): void {
    if (this.game.heatCubes > 0) {
      this.heatCubes++;
      this.game.heatCubes--;
      this.game.log('${0} gained a heat cube', ((b) => b.player(this)));
    }
  }

  public gainCredits(count: number) {
    const consumedCredits = this.game.getPlayers().map((p) => p.credits).reduce((a, b) => a + b, 0);
    const limit = 10 - consumedCredits;
    const earned = Math.min(count, limit);
    this.credits += earned;
    this.game.log('${0} gained ${1} credits', ((b) => b.player(this).number(earned)));
  }

  public getVictoryPoints(): VictoryPointsBreakdown {
    // Reset victory points
    this.victoryPointsBreakdown = new VictoryPointsBreakdown();

    // Victory points from awards
    this.giveAwards();

    // Victory points from milestones
    for (const milestone of this.game.claimedMilestones) {
      if (milestone.player !== undefined && milestone.player.id === this.id) {
        this.victoryPointsBreakdown.setVictoryPoints('milestones', 5, 'Claimed '+milestone.milestone.name+' milestone');
      }
    }

    // Victory points from board
    this.game.board.spaces.forEach((space) => {
      // Victory points for greenery tiles
      if (space.tile && space.tile.tileType === TileType.GREENERY && space.player !== undefined && space.player.id === this.id) {
        this.victoryPointsBreakdown.setVictoryPoints('greenery', 1);
      }

      // Victory points for greenery tiles adjacent to cities
      if (Board.hasCity(space) && space.player !== undefined && space.player.id === this.id) {
        const adjacent = this.game.board.getAdjacentSpaces(space);
        for (const adj of adjacent) {
          if (adj.tile && adj.tile.tileType === TileType.GREENERY) {
            this.victoryPointsBreakdown.setVictoryPoints('city', 1);
          }
        }
      }
    });

    this.victoryPointsBreakdown.updateTotal();
    return this.victoryPointsBreakdown;
  }

  public cardIsInEffect(cardName: CardName): boolean {
    return this.playedCards.find(
      (playedCard) => playedCard.name === cardName) !== undefined;
  }

  public getCitiesCount() {
    return this.game.getSpaceCount(TileType.CITY, this);
  }

  public getRequirementsBonus(): number {
    let requirementsBonus: number = 0;
    if (
      this.corporationCard !== undefined &&
          this.corporationCard.getRequirementBonus !== undefined) {
      requirementsBonus += this.corporationCard.getRequirementBonus(this);
    }
    for (const playedCard of this.playedCards) {
      if (playedCard.getRequirementBonus !== undefined &&
          playedCard.getRequirementBonus(this)) {
        requirementsBonus += playedCard.getRequirementBonus(this);
      }
    }

    return requirementsBonus;
  }

  public getAllTags(): Array<ITagCount> {
    return [
      {tag: Tag.ENERGY, count: this.countTags(Tag.ENERGY)},
      {tag: Tag.PRODUCTION, count: this.countTags(Tag.PRODUCTION)},
      {tag: Tag.NATURE, count: this.countTags(Tag.NATURE)},
      {tag: Tag.SCIENCE, count: this.countTags(Tag.SCIENCE)},
      {tag: Tag.SPACE, count: this.countTags(Tag.SPACE)},
    ].filter((tag) => tag.count > 0);
  }

  public countTags(tag: Tag, _options?: {cardsOnly: boolean}): number {
    let tagCount = 0;

    this.playedCards.forEach((card: IProjectCard) => {
      tagCount += card.tags.filter((cardTag) => cardTag === tag).length;
    });

    if (this.corporationCard !== undefined) {
      tagCount += this.corporationCard.tags.filter(
        (cardTag) => cardTag === tag,
      ).length;
    }
    return tagCount;
  }

  public getDistinctTagCount(extraTag?: Tag): number {
    const allTags: Tag[] = [];
    if (extraTag !== undefined) {
      allTags.push(extraTag);
    }
    const uniqueTags: Set<Tag> = new Set();
    if (this.corporationCard !== undefined && this.corporationCard.tags.length > 0) {
      this.corporationCard.tags.forEach((tag) => allTags.push(tag));
    }
    this.playedCards.forEach((card) => {
      card.tags.forEach((tag) => {
        allTags.push(tag);
      });
    });
    for (const tags of allTags) {
      uniqueTags.add(tags);
    }
    return uniqueTags.size;
  }

  // Return true if this player has all the tags in `tags` showing.
  public checkMultipleTagPresence(tags: Array<Tag>): boolean {
    let distinctCount = 0;
    tags.forEach((tag) => {
      if (this.countTags(tag) > 0) {
        distinctCount++;
      }
    });
    if (distinctCount >= tags.length) {
      return true;
    }
    return false;
  }

  public getCard(cards: Array<IProjectCard>, cardName: string): IProjectCard {
    const foundCard = cards.find((card) => card.name === cardName);
    if (foundCard === undefined) {
      throw new Error('Card not found');
    }
    return foundCard;
  }

  private runInputCb(result: PlayerInput | undefined): void {
    if (result !== undefined) {
      this.game.defer(new DeferredAction(this, () => result));
    }
  }

  private checkInputLength(input: ReadonlyArray<ReadonlyArray<string>>, length: number, firstOptionLength?: number) {
    if (input.length !== length) {
      throw new Error('Incorrect options provided');
    }
    if (firstOptionLength !== undefined && input[0].length !== firstOptionLength) {
      throw new Error('Incorrect options provided (nested)');
    }
  }

  // This is only public for a test. It's not great.
  // TODO(kberg): Fix taht.
  public runInput(input: ReadonlyArray<ReadonlyArray<string>>, pi: PlayerInput): void {
    if (pi instanceof AndOptions) {
      this.checkInputLength(input, pi.options.length);
      for (let i = 0; i < input.length; i++) {
        this.runInput([input[i]], pi.options[i]);
      }
      this.runInputCb(pi.cb());
    } else if (pi instanceof SelectAmount) {
      this.checkInputLength(input, 1, 1);
      const amount: number = parseInt(input[0][0]);
      if (isNaN(amount)) {
        throw new Error('Number not provided for amount');
      }
      if (amount > pi.max) {
        throw new Error('Amount provided too high (max ' + String(pi.max) + ')');
      }
      if (amount < pi.min) {
        throw new Error('Amount provided too low (min ' + String(pi.min) + ')');
      }
      this.runInputCb(pi.cb(amount));
    } else if (pi instanceof SelectOption) {
      this.runInputCb(pi.cb());
    } else if (pi instanceof OrOptions) {
      // input length is variable, can't test it with checkInputLength
      if (input.length === 0 || input[0].length !== 1) {
        throw new Error('Incorrect options provided');
      }
      const optionIndex = parseInt(input[0][0]);
      const selectedOptionInput = input.slice(1);
      this.runInput(selectedOptionInput, pi.options[optionIndex]);
      this.runInputCb(pi.cb());
    } else if (pi instanceof SelectCard) {
      this.checkInputLength(input, 1);
      if (input[0].length < pi.minCardsToSelect) {
        throw new Error('Not enough cards selected');
      }
      if (input[0].length > pi.maxCardsToSelect) {
        throw new Error('Too many cards selected');
      }
      const mappedCards: Array<ICard> = [];
      for (const cardName of input[0]) {
        mappedCards.push(this.getCard(pi.cards, cardName));
        if (pi.enabled?.[pi.cards.findIndex((card) => card.name === cardName)] === false) {
          throw new Error('Selected unavailable card');
        }
      }
      this.runInputCb(pi.cb(mappedCards));
    } else if (pi instanceof SelectAmount) {
      this.checkInputLength(input, 1, 1);
      const amount = parseInt(input[0][0]);
      if (isNaN(amount)) {
        throw new Error('Amount is not a number');
      }
      this.runInputCb(pi.cb(amount));
    } else if (pi instanceof SelectSpace) {
      this.checkInputLength(input, 1, 1);
      const foundSpace = pi.availableSpaces.find(
        (space) => space.id === input[0][0],
      );
      if (foundSpace === undefined) {
        throw new Error('Space not available');
      }
      this.runInputCb(pi.cb(foundSpace));
    } else if (pi instanceof SelectPlayer) {
      this.checkInputLength(input, 1, 1);
      const foundPlayer = pi.players.find(
        (player) => player.color === input[0][0] || player.id === input[0][0],
      );
      if (foundPlayer === undefined) {
        throw new Error('Player not available');
      }
      this.runInputCb(pi.cb(foundPlayer));
    } else {
      throw new Error('Unsupported waitingFor');
    }
  }

  public runProductionPhase(): void {
    this.actionsThisGeneration.clear();
    this.cubesPlacedThisGeneration.clear();
    this.credits += 5; // TODO

    if (this.corporationCard !== undefined && this.corporationCard.onProductionPhase !== undefined) {
      this.corporationCard.onProductionPhase(this);
    }
  }

  public dealCards(quantity: number, cards: Array<IProjectCard>): void {
    for (let i = 0; i < quantity; i++) {
      cards.push(this.game.dealer.dealCard(this.game));
    }
  }

  public getCardCost(card: IProjectCard): number {
    let cost: number = card.cost!;

    this.playedCards.forEach((playedCard) => {
      if (playedCard.getCardDiscount !== undefined) {
        cost -= playedCard.getCardDiscount(this, card);
      }
    });

    // Check corporation too
    if (this.corporationCard !== undefined && this.corporationCard.getCardDiscount !== undefined) {
      cost -= this.corporationCard.getCardDiscount(this, card);
    }

    return Math.max(cost, 0);
  }

  public playProjectCard(): PlayerInput {
    return new SelectCard<IProjectCard>(
      'Select project to play',
      'Save',
      this.getPlayableCards(),
      (selectedCard) => this.playCard(selectedCard[0]),
    );
  }

  public playCard(selectedCard: IProjectCard): undefined {
    const cardCost: number = this.getCardCost(selectedCard);
    this.credits -= cardCost;
    this.lastCardPlayed = selectedCard;
    this.game.log('${0} played ${1}', (b) => b.player(this).card(selectedCard));

    // Play the card
    const action = selectedCard.play(this);
    if (action !== undefined) {
      this.game.defer(new DeferredAction(
        this,
        () => action,
      ));
    }

    // Remove card from hand
    const projectCardIndex = this.cardsInHand.findIndex((card) => card.name === selectedCard.name);
    if (projectCardIndex !== -1) {
      this.cardsInHand.splice(projectCardIndex, 1);
    }

    for (const playedCard of this.playedCards) {
      if (playedCard.onCardPlayed !== undefined) {
        const actionFromPlayedCard: OrOptions | void = playedCard.onCardPlayed(this, selectedCard);
        if (actionFromPlayedCard !== undefined) {
          this.game.defer(new DeferredAction(
            this,
            () => actionFromPlayedCard,
          ));
        }
      }
    }

    for (const somePlayer of this.game.getPlayers()) {
      if (somePlayer.corporationCard !== undefined && somePlayer.corporationCard.onCardPlayed !== undefined) {
        const actionFromPlayedCard: OrOptions | void = somePlayer.corporationCard.onCardPlayed(this, selectedCard);
        if (actionFromPlayedCard !== undefined) {
          this.game.defer(new DeferredAction(
            this,
            () => actionFromPlayedCard,
          ));
        }
      }
    }

    return undefined;
  }

  public drawCard(count?: number, options?: DrawCards.DrawOptions): undefined {
    return DrawCards.keepAll(this, count, options).execute();
  }

  public drawCardKeepSome(count: number, options: DrawCards.AllOptions): SelectCard<IProjectCard> {
    return DrawCards.keepSome(this, count, options).execute();
  }

  private claimMilestone(milestone: IMilestone): SelectOption {
    return new SelectOption(milestone.name, 'Claim - ' + '('+ milestone.name + ')', () => {
      this.game.claimedMilestones.push({
        player: this,
        milestone: milestone,
      });
      this.credits -= this.game.claimedMilestones.length;
      this.game.log('${0} claimed ${1} milestone', (b) => b.player(this).milestone(milestone));
      return undefined;
    });
  }

  private fundAward(award: IAward): PlayerInput {
    return new SelectOption(award.name, 'Fund - ' + '(' + award.name + ')', () => {
      this.credits -= this.game.fundedAwards.length;
      this.game.fundAward(this, award);
      return undefined;
    });
  }

  private giveAwards(): void {
    this.game.fundedAwards.forEach((fundedAward) => {
      // Awards are disabled for 1 player games
      if (this.game.isSoloMode()) return;

      const players: Array<Player> = this.game.getPlayers().slice();
      players.sort(
        (p1, p2) => fundedAward.award.getScore(p2) - fundedAward.award.getScore(p1),
      );

      // We have one rank 1 player
      if (fundedAward.award.getScore(players[0]) > fundedAward.award.getScore(players[1])) {
        if (players[0].id === this.id) this.victoryPointsBreakdown.setVictoryPoints('awards', 5, '1st place for '+fundedAward.award.name+' award (funded by '+fundedAward.player.name+')');
        players.shift();

        if (players.length > 1) {
          // We have one rank 2 player
          if (fundedAward.award.getScore(players[0]) > fundedAward.award.getScore(players[1])) {
            if (players[0].id === this.id) this.victoryPointsBreakdown.setVictoryPoints('awards', 2, '2nd place for '+fundedAward.award.name+' award (funded by '+fundedAward.player.name+')');

          // We have at least two rank 2 players
          } else {
            const score = fundedAward.award.getScore(players[0]);
            while (players.length > 0 && fundedAward.award.getScore(players[0]) === score) {
              if (players[0].id === this.id) this.victoryPointsBreakdown.setVictoryPoints('awards', 2, '2nd place for '+fundedAward.award.name+' award (funded by '+fundedAward.player.name+')');
              players.shift();
            }
          }
        }

      // We have at least two rank 1 players
      } else {
        const score = fundedAward.award.getScore(players[0]);
        while (players.length > 0 && fundedAward.award.getScore(players[0]) === score) {
          if (players[0].id === this.id) this.victoryPointsBreakdown.setVictoryPoints('awards', 5, '1st place for '+fundedAward.award.name+' award (funded by '+fundedAward.player.name+')');
          players.shift();
        }
      }
    });
  }

  // Exposed for tests
  public pass(): void {
    this.game.playerHasPassed(this);
    this.lastCardPlayed = undefined;
  }

  private passOption(): PlayerInput {
    return new SelectOption('Pass for this generation', 'Pass', () => {
      this.pass();
      this.game.log('${0} passed', (b) => b.player(this));
      return undefined;
    });
  }

  public getPlayableCards(): Array<IProjectCard> {
    const candidateCards: Array<IProjectCard> = [...this.cardsInHand];
    return candidateCards.filter((card) => this.canPlay(card));
  }

  public canPlay(card: IProjectCard): boolean {
    const canAfford = this.canAfford(this.getCardCost(card));

    return canAfford && (card.canPlay === undefined || card.canPlay(this));
  }

  public canAfford(cost: number): boolean {
    return cost <= this.credits;
  }

  protected getStandardProjectOption(): SelectCard<StandardProjectCard> {
    const standardProjects = MANIFEST.standardProjects.map((e) => new e.Factory());

    return new SelectCard(
      'Standard projects',
      'Confirm',
      standardProjects,
      (card) => card[0].action(this),
      1, 1,
      standardProjects.map((card) => card.canAct(this)),
    );
  }

  public takeAction(): void {
    const game = this.game;

    if (game.deferredActions.length > 0) {
      game.deferredActions.runAll(() => this.takeAction());
      return;
    }

    const allOtherPlayersHavePassed = this.allOtherPlayersHavePassed();

    game.save();

    game.phase = Phase.ACTION;

    if (game.hasPassedThisActionPhase(this) || (allOtherPlayersHavePassed === false)) {
      game.playerIsFinishedTakingActions();
      return;
    }

    const corporationCard = this.corporationCard;
    if (corporationCard !== undefined &&
          corporationCard.initialAction !== undefined &&
          corporationCard.initialActionText !== undefined &&
          this.corporationInitialActionDone === false
    ) {
      const initialActionOption = new SelectOption(
        {
          message: 'Take first action of ${0} corporation',
          data: [{
            type: LogMessageDataType.RAW_STRING,
            value: corporationCard.name,
          }],
        },
        corporationCard.initialActionText, () => {
          game.defer(new DeferredAction(this, () => {
            if (corporationCard.initialAction) {
              return corporationCard.initialAction(this);
            } else {
              return undefined;
            }
          }));
          this.corporationInitialActionDone = true;
          return undefined;
        },
      );
      const initialActionOrPass = new OrOptions(
        initialActionOption,
        this.passOption(),
      );
      this.setWaitingFor(initialActionOrPass, () => {
        this.takeAction();
      });
      return;
    }

    this.setWaitingFor(this.getActions(), () => {
      this.takeAction();
    });
  }

  // Return possible mid-game actions like play a card and fund an award
  public getActions() {
    const action: OrOptions = new OrOptions();
    action.title = 'Select an available action.';
    action.buttonLabel = 'Take action';

    const milestoneCost = this.game.claimedMACount() + 1;
    if (this.canAfford(milestoneCost) && !this.game.allMAsClaimed()) {
      const remainingMilestones = new OrOptions();
      remainingMilestones.title = 'Claim a milestone';
      remainingMilestones.options = this.game.milestones
        .filter(
          (milestone: IMilestone) =>
            !this.game.milestoneClaimed(milestone) &&
            milestone.canClaim(this))
        .map(
          (milestone: IMilestone) =>
            this.claimMilestone(milestone));
      if (remainingMilestones.options.length >= 1) {
        action.options.push(remainingMilestones);
      }
    }

    if (this.getPlayableCards().length > 0) {
      action.options.push(
        this.playProjectCard(),
      );
    }

    const awardCost = this.game.claimedMACount() + 1;

    if (this.canAfford(awardCost) && !this.game.allMAsClaimed()) {
      const remainingAwards = new OrOptions();
      remainingAwards.title = 'Fund an award';
      remainingAwards.buttonLabel = 'Confirm';
      remainingAwards.options = this.game.awards
        .filter((award: IAward) => this.game.hasBeenFunded(award) === false)
        .map((award: IAward) => this.fundAward(award));
      action.options.push(remainingAwards);
    }

    action.options.push(this.getStandardProjectOption());

    action.options.push(this.passOption());

    return action;
  }

  private allOtherPlayersHavePassed(): boolean {
    const game = this.game;
    if (game.isSoloMode()) return true;
    const players = game.getPlayers();
    const passedPlayers = game.getPassedPlayers();
    return passedPlayers.length === players.length - 1 && passedPlayers.includes(this.color) === false;
  }

  public process(input: Array<Array<string>>): void {
    if (this.waitingFor === undefined || this.waitingForCb === undefined) {
      throw new Error('Not waiting for anything');
    }
    const waitingFor = this.waitingFor;
    const waitingForCb = this.waitingForCb;
    this.waitingFor = undefined;
    this.waitingForCb = undefined;
    try {
      this.timer.stop();
      this.runInput(input, waitingFor);
      waitingForCb();
    } catch (err) {
      this.setWaitingFor(waitingFor, waitingForCb);
      throw err;
    }
  }

  public getWaitingFor(): PlayerInput | undefined {
    return this.waitingFor;
  }

  public setWaitingFor(input: PlayerInput, cb: () => void): void {
    this.timer.start();
    this.waitingFor = input;
    this.waitingForCb = cb;
  }

  private serializePlayedCards(): Array<SerializedCard> {
    return this.playedCards.map((c) => {
      const result: SerializedCard = {
        name: c.name,
      };
      return result;
    });
  }

  public serialize(): SerializedPlayer {
    const result: SerializedPlayer = {
      id: this.id,
      corporationCard: this.corporationCard === undefined ? undefined : {
        name: this.corporationCard.name,
      },
      // Used only during set-up
      pickedCards: [this.pickedCards?.corp?.name, this.pickedCards?.corp?.name, this.pickedCards?.corp?.name],
      // Resources
      credits: this.credits,
      heat: this.heatCubes,
      // This generation / this round
      actionsThisGeneration: Array.from(this.actionsThisGeneration),
      corporationInitialActionDone: this.corporationInitialActionDone,
      // Cards
      dealtCorporationCards: this.dealtCorporationCards.map((c) => c.name),
      dealtProjectCards: this.dealtProjectCards.map((c) => c.name),
      cardsInHand: this.cardsInHand.map((c) => c.name),
      playedCards: this.serializePlayedCards(),
      draftedCards: this.draftedCards.map((c) => c.name),
      needsToDraft: this.needsToDraft,
      victoryPointsBreakdown: this.victoryPointsBreakdown,
      name: this.name,
      color: this.color,
      beginner: this.beginner,
      timer: this.timer.serialize(),
    };
    if (this.lastCardPlayed !== undefined) {
      result.lastCardPlayed = this.lastCardPlayed.name;
    }
    return result;
  }

  public static deserialize(d: SerializedPlayer): Player {
    const player = new Player(d.name, d.color, d.beginner, d.id);
    const cardFinder = new CardFinder();

    player.corporationInitialActionDone = d.corporationInitialActionDone;
    player.heatCubes = d.heat;
    player.credits = d.credits;
    player.needsToDraft = d.needsToDraft;
    player.victoryPointsBreakdown = d.victoryPointsBreakdown;

    player.lastCardPlayed = d.lastCardPlayed !== undefined ?
      cardFinder.getProjectCardByName(d.lastCardPlayed) :
      undefined;

    player.actionsThisGeneration = new Set<CardName>(d.actionsThisGeneration);

    if (d.pickedCards !== undefined) {
      // player.pickedCards = cardFinder.getCorporationCardByName(d.pickedCards[0]);
    }

    // Rebuild corporation card
    if (d.corporationCard !== undefined) {
      player.corporationCard = cardFinder.getCorporationCardByName(d.corporationCard.name);
    } else {
      player.corporationCard = undefined;
    }

    // Rebuild dealt corporation array
    player.dealtCorporationCards = cardFinder.corporationCardsFromJSON(d.dealtCorporationCards);

    // Rebuild dealt cards array
    player.dealtProjectCards = cardFinder.cardsFromJSON(d.dealtProjectCards);

    // Rebuild each cards in hand
    player.cardsInHand = cardFinder.cardsFromJSON(d.cardsInHand);

    // Rebuild each played card
    player.playedCards = d.playedCards.map((element: SerializedCard) => {
      const card = cardFinder.getProjectCardByName(element.name)!;
      return card;
    });

    // Rebuild each drafted cards
    player.draftedCards = cardFinder.cardsFromJSON(d.draftedCards);

    player.timer = Timer.deserialize(d.timer);

    return player;
  }
}
