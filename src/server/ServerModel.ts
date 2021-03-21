import {CardModel} from '../models/CardModel';
import {Color} from '../Color';
import {Game, GameOptions} from '../Game';
import {GameHomeModel} from '../models/GameHomeModel';
import {GameOptionsModel} from '../models/GameOptionsModel';
import {ICard} from '../cards/ICard';
import {IProjectCard} from '../cards/IProjectCard';
import {Board} from '../boards/Board';
import {ISpace} from '../boards/ISpace';
import {Player} from '../Player';
import {PlayerInput} from '../PlayerInput';
import {PlayerInputModel} from '../models/PlayerInputModel';
import {PlayerInputTypes} from '../PlayerInputTypes';
import {PlayerModel} from '../models/PlayerModel';
import {SelectAmount} from '../inputs/SelectAmount';
import {SelectCard} from '../inputs/SelectCard';
import {SelectPlayer} from '../inputs/SelectPlayer';
import {SelectSpace} from '../inputs/SelectSpace';
import {SpaceModel} from '../models/SpaceModel';
import {TileType} from '../TileType';
import {Phase} from '../Phase';
import {
  ClaimedMilestoneModel,
  IMilestoneScore,
} from '../models/ClaimedMilestoneModel';
import {FundedAwardModel, IAwardScore} from '../models/FundedAwardModel';
import {SpectatorModel} from '../models/SpectatorModel';

export class Server {
  public static getGameModel(game: Game): GameHomeModel {
    return {
      activePlayer: game.getPlayerById(game.activePlayer).color,
      id: game.id,
      phase: game.phase,
      players: game.getPlayers().map((player) => ({
        color: player.color,
        id: player.id,
        name: player.name,
      })),
      gameOptions: getGameOptionsAsModel(game.gameOptions),
      lastSoloGeneration: game.lastSoloGeneration(),
    };
  }

  public static getPlayerModel(player: Player): PlayerModel {
    const game = player.game;

    return {
      actionsThisGeneration: Array.from(player.getActionsThisGeneration()),
      awards: getAwards(game),
      cardCost: 104, // player.cardCost,
      cardsInHand: getCards(player, player.cardsInHand, {showNewCost: true}),
      cardsInHandNbr: player.cardsInHand.length,
      citiesCount: player.getCitiesCount(),
      color: player.color,
      corporationCard: getCorporationCard(player),
      dealtCorporationCards: getCards(player, player.dealtCorporationCards),
      dealtProjectCards: getCards(player, player.dealtProjectCards),
      deckSize: game.dealer.getDeckSize(),
      draftedCards: getCards(player, player.draftedCards, {showNewCost: true}),
      gameAge: game.gameAge,
      gameOptions: getGameOptionsAsModel(game.gameOptions),
      generation: game.getGeneration(),
      heatCubes: player.heatCubes,
      id: player.id,
      isActive: player.id === game.activePlayer,
      isSoloModeWin: game.isSoloModeWin(),
      lastSoloGeneration: game.lastSoloGeneration(),
      credits: player.credits,
      milestones: getMilestones(game),
      name: player.name,
      waterCubes: game.board.getWaterCubes().length,
      greeneryCubes: game.board.getGreeneryCubes().length,
      passedPlayers: game.getPassedPlayers(),
      phase: game.phase,
      pickedCards: getCards(player, [player.pickedCards?.corp, player.pickedCards?.award, player.pickedCards?.milestone].filter((x) => x !== undefined) as Array<ICard>),
      playedCards: getCards(player, player.playedCards),
      players: getPlayers(game.getPlayers(), game),
      spaces: getSpaces(game.board),
      spectatorId: game.spectatorId,
      tags: player.getAllTags(),
      timer: player.timer.serialize(),
      undoCount: game.undoCount,
      victoryPointsBreakdown: player.getVictoryPoints(),
      waitingFor: getWaitingFor(player, player.getWaitingFor()),
    };
  }

  public static getSpectatorModel(game: Game): SpectatorModel {
    return {
      generation: game.generation,
    };
  }
}

function getMilestones(game: Game): Array<ClaimedMilestoneModel> {
  const allMilestones = game.milestones;
  const claimedMilestones = game.claimedMilestones;
  const milestoneModels: Array<ClaimedMilestoneModel> = [];

  for (const milestone of allMilestones) {
    const claimed = claimedMilestones.find(
      (m) => m.milestone.name === milestone.name,
    );
    const scores: Array<IMilestoneScore> = [];
    if (claimed === undefined && claimedMilestones.length < 3) {
      game.getPlayers().forEach((player) => {
        scores.push({
          playerColor: player.color,
          playerScore: milestone.getScore(player),
        });
      });
    }

    milestoneModels.push({
      player_name: claimed === undefined ? '' : claimed.player.name,
      player_color: claimed === undefined ? '' : claimed.player.color,
      milestone,
      scores,
    });
  }

  return milestoneModels;
}

function getAwards(game: Game): Array<FundedAwardModel> {
  const allAwards = game.awards;
  const fundedAwards = game.fundedAwards;
  const awardModels: Array<FundedAwardModel> = [];

  for (const award of allAwards) {
    const funded = fundedAwards.find(
      (a) => a.award.name === award.name,
    );
    const scores: Array<IAwardScore> = [];
    if (fundedAwards.length < 3 || funded !== undefined) {
      game.getPlayers().forEach((player) => {
        scores.push({
          playerColor: player.color,
          playerScore: award.getScore(player),
        });
      });
    }

    awardModels.push({
      player_name: funded === undefined ? '' : funded.player.name,
      player_color: funded === undefined ? '' : funded.player.color,
      award,
      scores: scores,
    });
  }

  return awardModels;
}

function getCorporationCard(player: Player): CardModel | undefined {
  if (player.corporationCard === undefined) return undefined;
  return {
    name: player.corporationCard.name,
    cardType: 'corp',
    warning: player.corporationCard.warning,
    color: player.corporationCard.color,
  };
}

function getWaitingFor(
  player: Player,
  waitingFor: PlayerInput | undefined,
): PlayerInputModel | undefined {
  if (waitingFor === undefined) {
    return undefined;
  }
  const playerInputModel: PlayerInputModel = {
    title: waitingFor.title,
    buttonLabel: waitingFor.buttonLabel,
    inputType: waitingFor.inputType,
    amount: undefined,
    options: undefined,
    cards: undefined,
    maxCardsToSelect: undefined,
    minCardsToSelect: undefined,
    players: undefined,
    availableSpaces: undefined,
    min: undefined,
    max: undefined,
  };
  switch (waitingFor.inputType) {
  case PlayerInputTypes.AND_OPTIONS:
  case PlayerInputTypes.OR_OPTIONS:
    playerInputModel.options = [];
    if (waitingFor.options !== undefined) {
      for (const option of waitingFor.options) {
        const subOption = getWaitingFor(player, option);
        if (subOption !== undefined) {
          playerInputModel.options.push(subOption);
        }
      }
    } else {
      throw new Error('required options not defined');
    }
    break;
  case PlayerInputTypes.SELECT_CARD:
    const selectCard = waitingFor as SelectCard<ICard>;
    playerInputModel.cards = getCards(player, selectCard.cards, {
      showNewCost: !selectCard.played,
      enabled: selectCard.enabled,
    });
    playerInputModel.maxCardsToSelect = selectCard.maxCardsToSelect;
    playerInputModel.minCardsToSelect = selectCard.minCardsToSelect;
    playerInputModel.showOnlyInLearnerMode = selectCard.enabled?.every((p: boolean) => p === false);
    if (selectCard.showOwner) {
      playerInputModel.showOwner = true;
    }
    break;
  case PlayerInputTypes.SELECT_PLAYER:
    playerInputModel.players = (waitingFor as SelectPlayer).players.map(
      (player) => player.color,
    );
    break;
  case PlayerInputTypes.SELECT_SPACE:
    playerInputModel.availableSpaces = (waitingFor as SelectSpace).availableSpaces.map(
      (space) => space.id,
    );
    break;
  case PlayerInputTypes.SELECT_AMOUNT:
    playerInputModel.min = (waitingFor as SelectAmount).min;
    playerInputModel.max = (waitingFor as SelectAmount).max;
    break;
  }
  return playerInputModel;
}

function getCards(
  player: Player,
  cards: Array<ICard>,
  options: {
    showNewCost?: boolean,
    enabled?: Array<boolean>, // If provided, then the cards with false in `enabled` are not selectable and grayed out
  } = {},
): Array<CardModel> {
  return cards.map((card, index) => ({
    name: card.name,
    calculatedCost: options.showNewCost ? (card.cost === undefined ? undefined : player.getCardCost(card as IProjectCard)) : card.cost,
    cardType: card.cardType,
    isDisabled: options.enabled?.[index] === false,
    warning: card.warning,
    color: card.color,
  }));
}

// NOTE: This doesn't return a proper PlayerModel. It returns only a partial one, because
// many of the field's values aren't set. That's why the code needs an "as PlayerModel" at
// the end. Eyuch. Warning, surprises ahead.
function getPlayers(players: Array<Player>, game: Game): Array<PlayerModel> {
  return players.map((player) => {
    return {
      color: player.color,
      corporationCard: getCorporationCard(player),
      // TODO(kberg): strictly speaking, game options shouldn't be necessary on the
      // individual player level.
      gameOptions: getGameOptionsAsModel(game.gameOptions),
      heatCubes: player.heatCubes,
      id: game.phase === Phase.END ? player.id : player.color,
      credits: player.credits,
      name: player.name,
      playedCards: getCards(player, player.playedCards),
      cardsInHandNbr: player.cardsInHand.length,
      citiesCount: player.getCitiesCount(),
      victoryPointsBreakdown: player.getVictoryPoints(),
      isActive: player.id === game.activePlayer,
      tags: player.getAllTags(),
      actionsThisGeneration: Array.from(
        player.getActionsThisGeneration(),
      ),
      deckSize: game.dealer.getDeckSize(),
      timer: player.timer.serialize(),
    } as PlayerModel;
  });
}

// Oceans can't be owned so they shouldn't have a color associated with them
// Land claim can have a color on a space without a tile
function getColor(space: ISpace): Color | undefined {
  if (
    (space.tile === undefined || space.tile.tileType !== TileType.WATER) &&
    space.player !== undefined
  ) {
    return space.player.color;
  }
  return undefined;
}

function getSpaces(board: Board): Array<SpaceModel> {
  return board.spaces.map((space) => {
    return {
      x: space.x,
      y: space.y,
      id: space.id,
      tag: space.tag,
      spaceType: space.spaceType,
      tileType: space.tile && space.tile.tileType,
      color: getColor(space),
    };
  });
}

function getGameOptionsAsModel(options: GameOptions): GameOptionsModel {
  return {
    boardName: options.boardName,
    shuffleMap: options.shuffleMap,
  };
}
