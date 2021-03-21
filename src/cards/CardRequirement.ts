import {RequirementType} from './RequirementType';
import {Tag} from './Tag';
import {Player} from '../Player';
import {TileType} from '../TileType';
import {GlobalParameter} from '../GlobalParameter';

const firstLetterUpperCase = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

export class CardRequirement {
  constructor(private _type: RequirementType, protected _amount: number = 1, private _isMax: boolean = false, private _isAny: boolean = false) {}

  private _asterisk: boolean = false;

  private amountToString(): string {
    if (this._type === RequirementType.OXYGEN) {
      return `${this._amount}%`;
    } else if (this._type === RequirementType.HEAT) {
      return `${this._amount}°`;
    } else {
      return (this._amount !== 1 || this._isMax) ? this._amount.toString() : '';
    }
  }

  protected parseType(): string {
    const withPlural: Array<string> = [RequirementType.WATER_CUBES, RequirementType.GREENERIES, RequirementType.CITIES];

    if (this._amount > 1 && withPlural.includes(this._type)) {
      return this.getTypePlural();
    }

    return this._type;
  }

  // TODO (chosta): add to a top level class - preferrably translatable
  public getTypePlural(): string {
    if (this._type === RequirementType.CITIES) {
      return 'Cities';
    } else if (this._type === RequirementType.GREENERIES) {
      return 'Greeneries';
    } else {
      return `${this._type}s`;
    }
  }

  public getLabel(): string {
    let result: string = this._isMax ? 'max ' : '';
    const amount = this.amountToString();
    if (amount !== '') {
      result += amount;
      result += ' ';
    }
    result += this.parseType();

    if (this._asterisk) {
      result += ' *';
    }
    return result;
  }

  public max(): CardRequirement {
    this._isMax = true;
    return this;
  }

  public asterisk(): CardRequirement {
    this._asterisk = true;
    return this;
  }

  public any(): CardRequirement {
    this._isAny = true;
    return this;
  }

  public get isMax(): boolean {
    return this._isMax;
  }
  public get isAny(): boolean {
    return this._isAny;
  }
  public get type(): RequirementType {
    return this._type;
  }
  public get amount(): number {
    return this._amount;
  }

  protected satisfiesInequality(calculated: number) : boolean {
    if (this.isMax) {
      return calculated <= this.amount;
    }
    return calculated >= this.amount;
  }

  public satisfies(player: Player): boolean {
    switch (this.type) {
    case RequirementType.CITIES:
      if (this._isAny) {
        return this.satisfiesInequality(player.game.getCitiesInPlay());
      } else {
        return this.satisfiesInequality(player.getCitiesCount());
      }

    case RequirementType.GREENERIES:
      const greeneries = player.game.board.spaces.filter(
        (space) => space.tile !== undefined &&
            space.tile.tileType === TileType.GREENERY &&
            (space.player === player || this._isAny),
      ).length;
      return this.satisfiesInequality(greeneries);

    case RequirementType.WATER_CUBES:
      return player.game.checkRequirements(GlobalParameter.WATER, this.amount, this.isMax);

    case RequirementType.OXYGEN:
      return player.game.checkRequirements(GlobalParameter.GREENERIES, this.amount, this.isMax);

    case RequirementType.HEAT:
      return player.game.checkRequirements(GlobalParameter.HEAT, this.amount, this.isMax);

    case RequirementType.TAG:
    case RequirementType.PRODUCTION:
      throw `Use subclass satisfies() for requirement type ${this.type}`;
    }
  }
}

export class TagCardRequirement extends CardRequirement {
  constructor(public tag: Tag, amount: number = 1) {
    super(RequirementType.TAG, amount);
  }

  protected parseType(): string {
    return firstLetterUpperCase(this.tag);
  }
  public satisfies(player: Player): boolean {
    const tagCount = player.countTags(this.tag);

    return this.satisfiesInequality(tagCount);
  }
}
