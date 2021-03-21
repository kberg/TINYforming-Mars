import {Player} from '../Player';
import {Tag} from '../cards/Tag';
import {IProjectCard} from '../cards/IProjectCard';
import {DeferredAction, Priority} from './DeferredAction';
import {SelectCard} from '../inputs/SelectCard';
import {CardType} from '../cards/CardType';
import {LogHelper} from '../LogHelper';

// <T> is the return value type
export class DrawCards<T extends undefined | SelectCard<IProjectCard>> implements DeferredAction {
  public priority = Priority.DRAW_CARDS;
  private constructor(
    public player: Player,
    public count: number = 1,
    public options: DrawCards.AllOptions = {},
    public cb: (cards: Array<IProjectCard>) => T,
  ) { }

  public execute() : T {
    const game = this.player.game;
    const cards = game.dealer.drawProjectCardsByCondition(game, this.count, (card) => {
      if (this.options.cardType !== undefined && this.options.cardType !== card.cardType) {
        return false;
      }
      if (this.options.tag !== undefined && !card.tags.includes(this.options.tag)) {
        return false;
      }
      if (this.options.include !== undefined && !this.options.include(card)) {
        return false;
      }
      return true;
    });

    return this.cb(cards);
  };

  public static keepAll(player: Player, count: number = 1, options?: DrawCards.DrawOptions): DrawCards<undefined> {
    return new DrawCards(player, count, options, (cards) =>
      DrawCards.keep(player, cards, options === undefined ? DrawCards.LogType.DREW : DrawCards.LogType.DREW_VERBOSE));
  }

  public static keepSome(player: Player, count: number = 1, options: DrawCards.AllOptions): DrawCards<SelectCard<IProjectCard>> {
    return new DrawCards(player, count, options, (cards) => DrawCards.choose(player, cards, options));
  }
}

export namespace DrawCards {
  export interface DrawOptions {
    tag?: Tag,
    cardType?: CardType,
    include?: (card: IProjectCard) => boolean,
  }

  export interface ChooseOptions {
    keepMax?: number,
    logDrawnCard?: boolean,
  }

  export enum LogType {
    DREW='drew',
    DREW_VERBOSE='drew_verbose',
  }

  export interface AllOptions extends DrawOptions, ChooseOptions { }

  export function keep(player: Player, cards: Array<IProjectCard>, logType: LogType = LogType.DREW): undefined {
    player.cardsInHand.push(...cards);
    if (logType === LogType.DREW_VERBOSE) {
      LogHelper.logDrawnCards(player, cards);
    } else {
      LogHelper.logCardChange(player, logType, cards.length);
    }
    return undefined;
  }

  export function discard(player: Player, preserve: Array<IProjectCard>, discard: Array<IProjectCard>) {
    discard.forEach((card) => {
      if (preserve.find((f) => f.name === card.name) === undefined) {
        player.game.dealer.discard(card);
      }
    });
  }

  export function choose(player: Player, cards: Array<IProjectCard>, options: DrawCards.ChooseOptions): SelectCard<IProjectCard> {
    const max = options.keepMax || cards.length;
    const min = options.keepMax;
    const msg = `Select ${max} card(s) to keep`;
    const button = max === 0 ? 'Ok' : 'Select';
    const cb = (selected: Array<IProjectCard>) => {
      if (options.logDrawnCard === true) {
        keep(player, selected, DrawCards.LogType.DREW_VERBOSE);
        discard(player, selected, cards);
      } else {
        keep(player, selected, DrawCards.LogType.DREW);
        discard(player, selected, cards);
      }
      return undefined;
    };
    return new SelectCard(
      msg,
      button,
      cards,
      cb,
      max,
      min,
      undefined,
      false,
    );
  }
}
