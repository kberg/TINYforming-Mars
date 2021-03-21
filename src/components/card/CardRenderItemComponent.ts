import Vue from 'vue';
import {generateClassString} from '../../utils/utils';
import {CardRenderItem} from '../../cards/render/CardRenderItem';
import {CardRenderItemType} from '../../cards/render/CardRenderItemType';
import {CardRenderSymbol} from '../../cards/render/CardRenderSymbol';
import {CardRenderItemSize} from '../../cards/render/CardRenderItemSize';
import {CardRenderSymbolComponent} from './CardRenderSymbolComponent';

export const CardRenderItemComponent = Vue.component('CardRenderItemComponent', {
  props: {
    item: {
      type: Object as () => CardRenderItem,
    },
  },
  components: {
    CardRenderSymbolComponent,
  },
  methods: {
    getComponentClasses: function(): string {
      const classes: Array<string> = [];
      const type: CardRenderItemType = this.item.type;
      if (type === CardRenderItemType.TEMPERATURE) {
        classes.push('card-global-requirement');
        classes.push('card-temperature-global-requirement');
      } else if (type === CardRenderItemType.OXYGEN) {
        classes.push('card-global-requirement');
        classes.push('card-oxygen-global-requirement');
      } else if (type === CardRenderItemType.WATER) {
        classes.push('card-global-requirement');
        classes.push('card-ocean-global-requirement');
        if (this.item.size !== undefined && this.item.size !== CardRenderItemSize.MEDIUM) {
          classes.push(`card-ocean--${this.item.size}`);
        }
      } else if (type === CardRenderItemType.HEAT) {
        classes.push('card-resource');
        classes.push('card-resource-heat');
      } else if (type === CardRenderItemType.PLANTS) {
        classes.push('card-resource');
        classes.push('card-resource-plant');
      } else if (type === CardRenderItemType.CREDITS) {
        classes.push('card-resource');
        classes.push('card-resource-money');
        if (this.item.size !== undefined && this.item.size !== CardRenderItemSize.MEDIUM) {
          classes.push(`card-money--${this.item.size}`);
        }
      } else if (type === CardRenderItemType.CARDS) {
        classes.push('card-resource');
        classes.push('card-card');
      } else if (type === CardRenderItemType.SCIENCE) {
        classes.push('card-resource');
        classes.push('card-resource-science');
      } else if (type === CardRenderItemType.MULTIPLIER_WHITE) {
        classes.push('card-resource');
        classes.push('card-resource-trade-discount');
      } else if (type === CardRenderItemType.NO_TAGS) {
        classes.push('card-resource-tag');
        classes.push('card-community-services');
      } else if (type === CardRenderItemType.CITY) {
        classes.push('card-tile');
        classes.push(`city-tile--${this.item.size}`);
      } else if (type === CardRenderItemType.GREENERY) {
        classes.push('card-tile');
        if (this.item.secondaryTag === 'oxygen') {
          classes.push(`greenery-tile-oxygen--${this.item.size}`);
        } else {
          classes.push(`greenery-tile--${this.item.size}`);
        }
      } else if (type === CardRenderItemType.EMPTY_TILE) {
        if (this.item.size !== undefined) {
          classes.push(`board-space-tile--empty-tile--${this.item.size}`);
        }
      } else if (type === CardRenderItemType.EMPTY_TILE_GOLDEN) {
        classes.push('board-space-tile--adjacency-tile');
      }

      // round tags
      if (this.item.isPlayed) {
        // override resource behavior
        classes.push('card-resource-tag');
        if (type === CardRenderItemType.SPACE) {
          classes.push('card-tag-space');
        } else if (type === CardRenderItemType.SCIENCE) {
          classes.push('card-tag-science');
        } else if (type === CardRenderItemType.EARTH) {
          classes.push('card-tag-earth');
        } else if (type === CardRenderItemType.BUILDING) {
          classes.push('card-tag-building');
        }
      }

      // act upon any player
      if (this.item.anyPlayer === true) {
        classes.push('red-outline');
      }

      // golden background
      if (this.item.isPlate) {
        classes.push('card-plate');
      }

      // size and text
      if (this.item.text !== undefined) {
        classes.push(`card-text-size--${this.item.size}`);
        if (this.item.isUppercase) {
          classes.push('card-text-uppercase');
        }
        if (this.item.isBold) {
          classes.push('card-text-bold');
        } else {
          classes.push('card-text-normal');
        }
      }

      return generateClassString(classes);
    },
    getAmountAbs: function(): number {
      if (this.item.amountInside) return 1;
      return Math.abs(this.item.amount);
    },
    getMinus: function(): CardRenderSymbol {
      return CardRenderSymbol.minus();
    },
    itemsToShow: function(): number {
      if (this.item.showDigit) return 1;
      return this.getAmountAbs();
    },
    itemHtmlContent: function(): string {
      let result: string = '';
      // in case of symbols inside
      if (this.item instanceof CardRenderItem && this.item.amountInside) {
        if (this.item.amount !== 0) {
          result += this.item.amount.toString();
        }
        if (this.item.multiplier) {
          result += 'X';
        }
      }

      if (this.item.secondaryTag !== undefined && this.item.secondaryTag !== 'oxygen') {
        const classes: string[] = ['card-icon'];
        classes.push(`card-tag-${this.item.secondaryTag}`);
        result += '<div class="' + generateClassString(classes) + '"></div>';
      }
      if (this.item.isPlate || this.item.text !== undefined) {
        result += this.item.text || 'n/a';
      }
      if (this.item.type === CardRenderItemType.NO_TAGS || this.item.type === CardRenderItemType.MULTIPLIER_WHITE) {
        result = 'X';
      } else if (this.item.type === CardRenderItemType.PROJECT_REQUIREMENTS) {
        result += '<div class="card-project-requirements">';
        result += '<div class="card-x">x</div>';
        result += '<div class="card-requirements">Global Requirements</div>';
        result += '</div>';
      }
      if (this.item.type === CardRenderItemType.AWARD) {
        // iconography on card shows plural (awards)
        result = '<span class="card-award-icon">awards</span>';
      }
      if (this.item.type === CardRenderItemType.VP) {
        result = '<div class="card-resource points-big card-vp-questionmark">?</div>';
      }
      // TODO(chosta): find a reasonable way to represent "?" (alphanumeric maybe)
      if (this.item.type === CardRenderItemType.CREDITS && this.item.amount === 1000) {
        result = '?';
      }

      return result;
    },
  },
  template: `
        <div class="card-item-container">
            <div class="card-res-amount" v-if="item.showDigit">{{ getAmountAbs() }}</div>
            <div :class="getComponentClasses()" v-for="index in itemsToShow()" v-html="itemHtmlContent()" :key="index"/>
        </div>
    `,
});
