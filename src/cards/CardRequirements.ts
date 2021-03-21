import {CardRequirement, TagCardRequirement} from './CardRequirement';
import {RequirementType} from './RequirementType';
import {Tag} from './Tag';
import {Player} from '../Player';
import {INITIAL_GREENERIES, INITIAL_HEAT_CUBES, INITIAL_WATER_CUBES} from '../constants';

export class CardRequirements {
  constructor(private requirements: Array<CardRequirement>) {}

  public static builder(f: (builder: Builder) => void): CardRequirements {
    const builder = new Builder();
    f(builder);
    return builder.build();
  }
  public getRequirementsText(): string {
    const reqTexts: Array<string> = this.requirements.map((req) => req.getLabel());
    if (this.hasAny()) {
      reqTexts.unshift('Any');
    }
    return reqTexts.join(' ');
  }
  public hasMax(): boolean {
    return this.requirements.some((req) => req.isMax);
  }
  public hasAny(): boolean {
    return this.requirements.some((req) => req.isAny);
  }
  public satisfies(player: Player): boolean {
    const tags = this.requirements.filter((requirement) => requirement.type === RequirementType.TAG)
      .map((requirement) => (requirement as TagCardRequirement).tag);
    if (!player.checkMultipleTagPresence(tags)) {
      return false;
    }
    return this.requirements.every((requirement: CardRequirement) => requirement.satisfies(player));
  }
}

class Builder {
  private reqs: Array<CardRequirement> = [];

  public build(): CardRequirements {
    return new CardRequirements(this.reqs);
  }

  public water(amount: number): Builder {
    if (amount <= 0 || amount > INITIAL_WATER_CUBES) {
      throw new Error('invalid amount: ' + amount);
    }
    this.reqs.push(new CardRequirement(RequirementType.WATER_CUBES, amount));
    return this;
  }

  public oxygen(amount: number): Builder {
    if (amount < 0 || amount > INITIAL_GREENERIES) {
      throw new Error('Oxygen must be above 0 and below ' + INITIAL_GREENERIES);
    }
    this.reqs.push(new CardRequirement(RequirementType.OXYGEN, amount));
    return this;
  }

  public heat(amount: number): Builder {
    if (amount < 0 || amount > INITIAL_HEAT_CUBES) {
      throw new Error('Heat cubes must be above 0 and below ' + INITIAL_HEAT_CUBES);
    }
    this.reqs.push(new CardRequirement(RequirementType.HEAT, amount));
    return this;
  }

  public greeneries(amount?: number): Builder {
    this.reqs.push(new CardRequirement(RequirementType.GREENERIES, amount));
    return this;
  }

  public cities(amount?: number): Builder {
    this.reqs.push(new CardRequirement(RequirementType.CITIES, amount));
    return this;
  }

  public nature(amount?: number) {
    return this.tag(Tag.NATURE, amount);
  }

  public science(amount?: number) {
    return this.tag(Tag.SCIENCE, amount);
  }

  public production(amount?: number) {
    return this.tag(Tag.PRODUCTION, amount);
  }

  public space(amount?: number) {
    return this.tag(Tag.SPACE, amount);
  }

  public energy(amount?: number) {
    return this.tag(Tag.ENERGY, amount);
  }

  private tag(tag: Tag, amount?: number) {
    this.reqs.push(new TagCardRequirement(tag, amount));
    return this;
  }

  public max(): Builder {
    const req = this.reqs.pop();
    if (req === undefined) {
      throw new Error('Called max without a CardRequirement.');
    }
    this.reqs.push(req.max());
    return this;
  }

  public asterisk(): Builder {
    const req = this.reqs.pop();
    if (req === undefined) {
      throw new Error('Called any without a CardRequirement.');
    }
    this.reqs.push(req.asterisk());
    return this;
  }

  public any(): Builder {
    const req = this.reqs.pop();
    if (req === undefined) {
      throw new Error('Called any without a CardRequirement.');
    }
    this.reqs.push(req.any());
    return this;
  }
}
