import {CardName} from '../CardName';
import {Charger} from './Charger';
import {Collector} from './Collector';
import {Discounter} from './Discounter';
import {Explorer} from './Explorer';
import {IMilestone} from './IMilestone';
import {JackOfAllTrades} from './JackOfAllTrades';
import {Multitasker} from './Multitasker';

export namespace Milestones {
  export const ALL = [
    new Collector(),
    new Charger(),
    new Explorer(),
    new Discounter(),
    new JackOfAllTrades(),
    new Multitasker(),
  ];

  export function getByName(name: CardName): IMilestone {
    const milestone = ALL.find((m) => m.name === name);
    if (milestone) {
      return milestone;
    }
    throw new Error(`Milestone ${name} not found.`);
  }
}
