import {CardName} from '../CardName';

export interface ICardFactory<T> {
    cardName: CardName;
    Factory: new () => T;
}
