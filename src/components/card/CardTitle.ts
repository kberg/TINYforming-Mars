import Vue from 'vue';
import {CardCorporationLogo} from './CardCorporationLogo';

export const CardTitle = Vue.component('CardTitle', {
  props: {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      // validator: (card: CardType) => Object.values(CardType).includes(card),
    },
  },
  components: {
    CardCorporationLogo,
  },
  methods: {
    isCorporation: function(): boolean {
      return this.type === 'corp';
    },
    getClasses: function(title: string): string {
      const classes: Array<String> = ['card-title'];

      if (this.type === 'project') {
        classes.push('background-color-automated');
      } else if (this.type === 'active') {
        classes.push('background-color-active');
      } else if (this.type === 'standard') {
        classes.push('background-color-standard-project');
      }

      const trimmedTitle = this.getCardTitleWithoutSuffix(title);

      if (trimmedTitle.length > 26) {
        classes.push('title-smaller');
      } else if (trimmedTitle.length > 23) {
        classes.push('title-small');
      }

      return classes.join(' ');
    },
    getMainClasses() {
      const classes: Array<String> = ['card-title'];
      if (this.type === 'standard') {
        classes.push('card-title-standard-project');
      }
      return classes.join(' ');
    },
    getCardTitleWithoutSuffix(title: string): string {
      return title.split(':')[0];
    },
  },
  template: `
      <div :class="getMainClasses()">
          <div v-if="isCorporation()" class="corporation-label">corporation</div>
          <CardCorporationLogo v-if="isCorporation()" :title="title"/>
          <div v-else :class="getClasses(title)">{{ getCardTitleWithoutSuffix(title) }}</div>
      </div>
  `,
});
