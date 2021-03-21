import {Player} from '../Player';
import {CardColor, IActionCard, ICard} from './ICard';
import {OrOptions} from '../inputs/OrOptions';
import {SelectAmount} from '../inputs/SelectAmount';
import {SelectOption} from '../inputs/SelectOption';
import {IProjectCard} from './IProjectCard';
import {SelectPlayer} from '../inputs/SelectPlayer';
import {AndOptions} from '../inputs/AndOptions';
import {SelectCard} from '../inputs/SelectCard';
import {SelectSpace} from '../inputs/SelectSpace';
import {CardMetadata} from './CardMetadata';
import {CardName} from '../CardName';
import {Card} from './Card';

interface StaticStandardProjectCardProperties {
  name: CardName,
  cost: number,
  metadata: CardMetadata,
  color: CardColor,
}

export abstract class StandardProjectCard extends Card implements IActionCard, ICard {
  constructor(properties: StaticStandardProjectCardProperties) {
    super({
      cardType: 'standard',
      ...properties,
    });
  }

  protected discount(_player: Player) {
    return 0;
  }

  public play() {
    return undefined;
  }

  protected abstract actionEssence(player: Player): void

  public onStandardProject(player: Player): void {
    if (player.corporationCard?.onStandardProject !== undefined) {
      player.corporationCard.onStandardProject(player, this);
    }

    for (const playedCard of player.playedCards) {
      if (playedCard.onStandardProject !== undefined) {
        playedCard.onStandardProject(player, this);
      }
    }
  }

  public canAct(player: Player): boolean {
    return player.canAfford(this.cost - this.discount(player));
  }

  protected projectPlayed(player: Player) {
    player.game.log('${0} used ${1} standard project', (b) => b.player(player).card(this));
    this.onStandardProject(player);
  }

  public action(player: Player): OrOptions | SelectOption | AndOptions | SelectAmount | SelectCard<ICard> | SelectCard<IProjectCard> | SelectPlayer | SelectSpace | undefined {
    player.credits -= (this.cost - this.discount(player)),
    this.actionEssence(player);
    this.projectPlayed(player);
    return undefined;
  }
}
