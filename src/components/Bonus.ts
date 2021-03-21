import Vue from 'vue';
import {Tag} from '../cards/Tag';

export const Bonus = Vue.component('bonus', {
  props: {
    bonus: {
      type: Array as () => Array<Tag>,
    },
  },
  data: function() {
    return {};
  },
  render: function(createElement) {
    const tags = [];
    let idx = 0;

    const build_css_class = (idx: number, tag: Tag):string => {
      let ret = 'board-space-bonus board-space-bonus--';
      switch (tag) {
      case Tag.ENERGY:
        ret += 'titanium';
        break;
      case Tag.NATURE:
        ret += 'titanium';
        break;
      case Tag.PRODUCTION:
        ret += 'titanium';
        break;
      case Tag.SCIENCE:
        ret += 'titanium';
        break;
      case Tag.SPACE:
        ret += 'titanium';
        break;
      }
      ret += ' board-space-bonus-pos--' + idx.toString();
      return ret;
    };

    for (const bonus of this.bonus) {
      idx += 1;
      tags.push(
        createElement('i', {'class': build_css_class(idx, bonus)}),
      );
    }
    return createElement('div', {'class': 'board-space-bonuses'}, tags);
  },
});
