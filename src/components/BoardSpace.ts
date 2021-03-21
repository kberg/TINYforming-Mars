import Vue from 'vue';
import {Bonus} from './Bonus';
import {SpaceModel} from '../models/SpaceModel';
import {SpaceType} from '../SpaceType';
import {TileType} from '../TileType';

export const BoardSpace = Vue.component('board-space', {
  props: {
    space: {
      type: Object as () => SpaceModel,
    },
    text: {
      type: String,
    },
    is_selectable: {
      type: Boolean,
    },
  },
  data: function() {
    return {};
  },
  components: {
    'bonus': Bonus,
  },
  methods: {
    getMainClass: function(): string {
      let css = 'board-space board-space-' + this.space.id.toString();
      if (this.is_selectable) {
        css += ' board-space-selectable';
      }
      return css;
    },
    getTileClass: function(): string {
      let css = 'board-space';
      const tileType = this.space.tileType;
      if (tileType !== undefined) {
        switch (this.space.tileType) {
        case TileType.WATER:
          css += ' board-space-tile--ocean';
          break;
        case TileType.CITY:
          css += ' board-space-tile--city';
          break;
        case TileType.GREENERY:
          css += ' board-space-tile--greenery';
          break;
        }
      } else {
        if (this.space.spaceType === SpaceType.WATER) {
          css += ' board-space-type-ocean';
        } else {
          css += ` board-space-type-land`;
        }
      }
      return css;
    },
  },
  template: `
        <div :class="getMainClass()" :data_space_id="space.id">
            <div :class="getTileClass()"></div>
            <div class="board-space-text" v-if="text" v-i18n>{{ text }}</div>
            <bonus :bonus="space.tag" v-if="space.tileType === undefined"></bonus>
            <div :class="'board-cube board-cube--'+space.color" v-if="space.color !== undefined"></div>
        </div>
    `,
});
