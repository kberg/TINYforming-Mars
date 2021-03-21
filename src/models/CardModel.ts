import {Message} from '../Message';
import {CardType} from '../cards/CardType';
import {CardName} from '../CardName';
import {CardColor} from '../cards/ICard';

export interface CardModel {
    name: CardName;
    calculatedCost?: number;
    cardType: CardType;
    warning?: string | Message;
    color: CardColor;
}
