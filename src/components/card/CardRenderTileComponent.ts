import Vue from 'vue';
import {CardRenderTile} from '../../cards/render/CardRenderer';
import {generateClassString} from '../../utils/utils';

export const CardRenderTileComponent = Vue.component('CardRenderTileComponent', {
  props: {
    item: {
      type: Object as () => CardRenderTile,
      required: true,
    },
  },
  methods: {
    getClasses: function(): string {
      const classes: string[] = ['card-tile'];
      if (this.item.hasSymbol) {
        classes.push('card-tile-canvas');
      }
      return generateClassString(classes);
    },
    // Symbols for tiles go on top of the tile canvas
    getHtml: function(): string {
      const classes: string[] = [];
      if (this.item.hasSymbol) {
        classes.push('card-tile-symbol');
      }
      return '<div class="' + generateClassString(classes) + '"/></div>';
    },
  },
  template: `
    <div :class="getClasses()" v-html="getHtml()"></div>
  `,
});
