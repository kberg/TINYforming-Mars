import {CardMetadata} from './CardMetadata';
import {CardName} from '../CardName';
import {CardType} from './CardType';
import {Tag} from './Tag';
import {Player} from '../Player';
import {CardRequirements} from './CardRequirements';
import {CardColor} from './ICard';

export interface StaticCardProperties {
  cardType: CardType;
  cost?: number;
  color: CardColor;
  initialActionText?: string;
  metadata: CardMetadata;
  requirements?: CardRequirements;
  name: CardName;
  startingCredits?: number;
  tags?: Array<Tag>;
}

export const staticCardProperties = new Map<CardName, StaticCardProperties>();

export abstract class Card {
  private readonly properties: StaticCardProperties;
  constructor(properties: StaticCardProperties) {
    let staticInstance = staticCardProperties.get(properties.name);
    if (staticInstance === undefined) {
      if (properties.cardType === 'corp' && properties.startingCredits === undefined) {
        throw new Error('must define startingCredits for corporation cards');
      }
      if (properties.cost === undefined) {
        if (['corp'].includes(properties.cardType) === false) {
          throw new Error(`${properties.name} must have a cost property`);
        }
      }
      staticCardProperties.set(properties.name, properties);
      staticInstance = properties;
    }
    this.properties = staticInstance;
  }
  public get cardType() {
    return this.properties.cardType;
  }
  public get cost() {
    return this.properties.cost === undefined ? 0 : this.properties.cost;
  }
  public get color() {
    return this.properties.color;
  }
  public get initialActionText() {
    return this.properties.initialActionText;
  }
  public get metadata() {
    return this.properties.metadata;
  }
  public get requirements() {
    return this.properties.requirements;
  }
  public get name() {
    return this.properties.name;
  }
  public get startingCredits() {
    return this.properties.startingCredits === undefined ? 0 : this.properties.startingCredits;
  }
  public get tags() {
    return this.properties.tags === undefined ? [] : this.properties.tags;
  }
  public canPlay(player: Player) {
    if (this.properties.requirements === undefined) {
      return true;
    }
    return this.properties.requirements.satisfies(player);
  }
}
