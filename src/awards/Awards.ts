import {DryHeat} from './DryHeat';
import {IAward} from './IAward';

export namespace Awards {
  export const ALL = [
    new DryHeat(),
  ];

  export function getByName(name: string): IAward {
    const award = ALL.find((a) => a.name === name);
    if (award) {
      return award;
    }
    throw new Error(`Award ${name} not found.`);
  }
}
