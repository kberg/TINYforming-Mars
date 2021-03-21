import {ICard} from './cards/ICard';
import {ICardFactory} from './cards/ICardFactory';
import {IProjectCard} from './cards/IProjectCard';
import {CardName} from './CardName';
import {CorporationCard} from './cards/corporation/CorporationCard';
import {MANIFEST} from './cards/Cards';

export class CardFinder {
  public getCardByName<T extends ICard>(cardName: CardName, deck: Array<ICardFactory<T>>): T | undefined {
    const factory = deck.find((e) => e.cardName === cardName);
    return factory ? new factory.Factory() : undefined;
  }

  public getCorporationCardByName(cardName: CardName): CorporationCard | undefined {
    return this.getCardByName(cardName, MANIFEST.corporationCards);
  }

  public getProjectCardByName(cardName: CardName): IProjectCard | undefined {
    return this.getCardByName(cardName, MANIFEST.projectCards);
  }

  public cardsFromJSON(cards: Array<ICard | CardName>): Array<IProjectCard> {
    if (cards === undefined) {
      console.warn('missing cards calling cardsFromJSON');
      return [];
    }
    const result: Array<IProjectCard> = [];
    cards.forEach((element: ICard | CardName) => {
      if (typeof element !== 'string') {
        element = element.name;
      }
      const card = this.getProjectCardByName(element);
      if (card !== undefined) {
        result.push(card);
      } else {
        console.warn(`card ${element} not found while loading game.`);
      }
    });
    return result;
  }

  public corporationCardsFromJSON(cards: Array<ICard | CardName>): Array<CorporationCard> {
    if (cards === undefined) {
      console.warn('missing cards calling corporationCardsFromJSON');
      return [];
    }
    const result: Array<CorporationCard> = [];
    cards.forEach((element: ICard | CardName) => {
      if (typeof element !== 'string') {
        element = element.name;
      }
      const card = this.getCorporationCardByName(element);
      if (card !== undefined) {
        result.push(card);
      } else {
        console.warn(`corporation ${element} not found while loading game.`);
      }
    });
    return result;
  }
}
