import Vue from 'vue';
import {GameOptionsModel} from '../models/GameOptionsModel';
import {BoardName} from '../boards/BoardName';

export const GameSetupDetail = Vue.component('game-setup-detail', {
  props: {
    playerNumber: {
      type: Number,
    },
    gameOptions: {
      type: Object as () => GameOptionsModel,
    },
    lastSoloGeneration: {
      type: Number,
    },
  },
  methods: {
    getBoardColorClass: function(boardName: string): string {
      if (boardName === BoardName.THARSIS) {
        return 'game-config board-tharsis map';
      } else if (boardName === BoardName.HELLAS) {
        return 'game-config board-hellas map';
      } else if (boardName === BoardName.ELYSIUM) {
        return 'game-config board-elysium map';
      } else {
        return 'game-config board-other map';
      }
    },
  },
  template: `
        <div id="game-setup-detail" class="game-setup-detail-container">
          <ul>
            <li><div class="setup-item" v-i18n>Board:</div>
              <span :class="getBoardColorClass(gameOptions.boardName)" v-i18n>{{ gameOptions.boardName }}</span>
              &nbsp;
              <span v-if="gameOptions.shuffleMap" class="game-config generic" v-i18n>(randomized tiles)</span>
            </li>

            <li><div class="setup-item" v-i18n>WGT:</div>
              <div v-if="gameOptions.solarPhaseOption" class="game-config generic" v-i18n>On</div>
              <div v-else class="game-config generic" v-i18n>Off</div>
            </li>

            <li><div class="setup-item" v-i18n>Game configs:</div>
              <div v-if="gameOptions.showTimers" class="game-config timer" v-i18n>timer</div>
              <div v-if="gameOptions.showOtherPlayersVP" class="game-config realtime-vp" v-i18n>real-time vp</div>
              <div v-if="gameOptions.undoOption" class="game-config undo" v-i18n>undo</div>
            </li>
          </ul>
        </div>
    `,
});
