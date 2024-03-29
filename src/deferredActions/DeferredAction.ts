import {Player} from '../Player';
import {PlayerInput} from '../PlayerInput';

export enum Priority {
  COST, // Cost of a blue card action. Must happen before the effects.
  OPPONENT_TRIGGER, // Any effect from one of your opponent's card that triggers during your turn.
  DISCARD_BEFORE_DRAW, // When you must discard before you can draw. Mars University, Sponsored Academies.
  DRAW_CARDS,
  PLACE_WATER_CUBE,
  DEFAULT, // Anything that doesn't fit into another category.
  ATTACK_OPPONENT, // Effects that make your opponents lose resources or production.
  LOSE_AS_MUCH_AS_POSSIBLE, // Effects that make you lose resource or production "as much as possible". Pharmacy Union, Mons.
  DISCARD_CARDS,
}

export class DeferredAction {
  public queueId?: number;
  public priority: Priority = Priority.DEFAULT;
  constructor(
    public player: Player,
    public execute: () => PlayerInput | undefined,
  ) {}
}
