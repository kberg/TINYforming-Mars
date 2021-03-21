import Vue from 'vue';
import {PlayerModel} from '../../models/PlayerModel';

export const PlayerResources = Vue.component('player-resources', {
  props: {
    player: {
      type: Object as () => PlayerModel,
    },
  },
  data: function() {
    return {
      // resources: Resources,
    };
  },
  methods: {
  },
  components: {
    // 'player-resource': PlayerResource,
  },
  template: `
        <div class="resource_items_cont">
        <div>Credits: {{player.credits}}</div>
        <div>Heat: {{player.heatCubes}}</div>
        </div>
    `,
});
