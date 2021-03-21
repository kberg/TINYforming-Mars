import {ICard} from '../ICard';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {OrOptions} from '../../inputs/OrOptions';
import {BoardType} from '../../boards/BoardType';
import {ISpace} from '../../boards/ISpace';
import {CardName} from '../../CardName';

export interface CorporationCard extends ICard {
  name: CardName;
  initialActionText?: string;
  initialAction?: (player: Player) => PlayerInput | undefined;
  startingCredits: number;
  cardCost?: number;
  onCorpCardPlayed?: (
      player: Player,
      card: CorporationCard
  ) => OrOptions | void;
  onProductionPhase?: (player: Player) => undefined;
  onTilePlaced?: (cardOwner: Player, activePlayer: Player, space: ISpace, boardType: BoardType) => void;
}
