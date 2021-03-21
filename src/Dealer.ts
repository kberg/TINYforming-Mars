import {CorporationCard} from './cards/corporation/CorporationCard';
import {IProjectCard} from './cards/IProjectCard';
import {ISerializable} from './ISerializable';
import {SerializedDealer} from './SerializedDealer';
import {CardFinder} from './CardFinder';
import {CardName} from './CardName';
import {LogHelper} from './LogHelper';
import {Game} from './Game';
import {MANIFEST} from './cards/Cards';
import {ICardFactory} from './cards/ICardFactory';
import {IAward} from './awards/IAward';
import {IMilestone} from './milestones/IMilestone';

export class Dealer implements ISerializable<SerializedDealer> {
    public deck: Array<IProjectCard> = [];
    public discarded: Array<IProjectCard> = [];
    public corporationCards: Array<CorporationCard> = [];
    public awards: Array<IAward> = [];
    public milestones: Array<IMilestone> = [];

    private constructor() {
      this.deck = this.shuffle(this.getCards(MANIFEST.projectCards));
      this.corporationCards = this.shuffle(this.getCards(MANIFEST.corporationCards));
      this.awards = this.shuffle(this.getCards(MANIFEST.awards));
      this.milestones = this.shuffle(this.getCards(MANIFEST.milestones));
    }

    public static newInstance(): Dealer {
      return new Dealer();
    }

    private getCards<T>(factories: Array<ICardFactory<T>>) : Array<T> {
      return factories.map((e) => new e.Factory());
    }

    private shuffle<T>(cards: Array<T>): Array<T> {
      const deck: Array<T> = [];
      const copy = cards.slice();
      while (copy.length) {
        deck.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
      }
      return deck;
    }

    public discard(card: IProjectCard): void {
      this.discarded.push(card);
    }

    public dealCard(game: Game): IProjectCard {
      const result = this.deck.pop();
      if (result === undefined) {
        throw 'Unexpected empty deck';
      }

      if (this.deck.length === 0) {
        game.log('The discard pile has been shuffled to form a new deck.');
        this.deck = this.shuffle(this.discarded);
        this.discarded = [];
      }

      return result;
    }

    public drawProjectCardsByCondition(game: Game, total: number, include: (card: IProjectCard) => boolean) {
      const result: Array<IProjectCard> = [];
      const discardedCards = new Set<CardName>();

      while (result.length < total) {
        if (discardedCards.size >= this.getDeckSize() + this.getDiscardedSize()) {
          game.log('discarded every card without match');
          break;
        }
        const projectCard = this.dealCard(game);
        if (include(projectCard)) {
          result.push(projectCard);
        } else {
          discardedCards.add(projectCard.name);
          this.discard(projectCard);
        }
      }
      if (discardedCards.size > 0) {
        LogHelper.logDiscardedCards(game, Array.from(discardedCards));
      }

      return result;
    }

    public getDeckSize(): number {
      return this.deck.length;
    }

    public getDiscardedSize(): number {
      return this.discarded.length;
    }

    public static deserialize(d: SerializedDealer): Dealer {
      const dealer = new Dealer();
      const cardFinder = new CardFinder();

      dealer.corporationCards = cardFinder.corporationCardsFromJSON(d.corporationCards);
      dealer.deck = cardFinder.cardsFromJSON(d.deck);
      dealer.discarded = cardFinder.cardsFromJSON(d.discarded);
      return dealer;
    }

    public serialize(): SerializedDealer {
      return {
        corporationCards: this.corporationCards.map((c) => c.name),
        deck: this.deck.map((c) => c.name),
        discarded: this.discarded.map((c) => c.name),
      };
    }
}
