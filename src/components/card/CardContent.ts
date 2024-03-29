import Vue from 'vue';
import {CardMetadata} from '../../cards/CardMetadata';
import {CardRequirementsComponent} from './CardRequirementsComponent';
import {CardDescription} from './CardDescription';
import {CardRenderData} from './CardRenderData';
import {CardRequirements} from '../../cards/CardRequirements';

export const CardContent = Vue.component('CardContent', {
  props: {
    metadata: {
      type: Object as () => CardMetadata,
      required: true,
    },
    requirements: {
      type: Object as () => CardRequirements,
    },
    isCorporation: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    CardRequirementsComponent,
    CardDescription,
    CardRenderData,
  },
  methods: {
    getClasses: function(): string {
      const classes: Array<string> = ['card-content'];
      if (this.isCorporation) {
        classes.push('card-content-corporation');
      }
      return classes.join(' ');
    },
  },
  template: `
        <div :class="getClasses()">
            <CardRequirementsComponent v-if="requirements !== undefined" :requirements="requirements"/>
            <CardRenderData v-if="metadata.renderData !== undefined" :renderData="metadata.renderData" />
            <CardDescription v-if="metadata.description !== undefined" :item="metadata.description" />
        </div>
    `,
});
