import Vue from 'vue';

import {Board} from './Board';
import {Card} from './card/Card';
import {Milestone} from './Milestone';
import {Award} from './Award';
import {PlayersOverview} from './overview/PlayersOverview';
import {WaitingFor} from './WaitingFor';
import {Preferences} from './Preferences';
import {PlayerModel} from '../models/PlayerModel';
import {LogPanel} from './LogPanel';
import {PlayerMixin} from './PlayerMixin';
import {playerColorClass} from '../utils/utils';
import {DynamicTitle} from './common/DynamicTitle';
import {Button} from './common/Button';
import {SortableCards} from './SortableCards';
import {PreferencesManager} from './PreferencesManager';
import {KeyboardNavigation} from '../../src/KeyboardNavigation';

import * as raw_settings from '../genfiles/settings.json';

export const PlayerHome = Vue.component('player-home', {
  data: () => {
    return {};
  },
  props: {
    player: {
      type: Object as () => PlayerModel,
    },
    settings: {
      type: Object as () => typeof raw_settings,
    },
  },
  components: {
    'board': Board,
    'dynamic-title': DynamicTitle,
    Card,
    'players-overview': PlayersOverview,
    'waiting-for': WaitingFor,
    'milestone': Milestone,
    'award': Award,
    'preferences': Preferences,
    'log-panel': LogPanel,
    'Button': Button,
    'sortable-cards': SortableCards,
  },
  mixins: [PlayerMixin],
  methods: {
    navigatePage: function(event: KeyboardEvent) {
      const inputSource = event.target as Element;
      if (inputSource.nodeName.toLowerCase() !== 'input') {
        let idSuffix: string | undefined = undefined;
        switch (event.code) {
        case KeyboardNavigation.GAMEBOARD:
          idSuffix = 'board';
          break;
        case KeyboardNavigation.PLAYERSOVERVIEW:
          idSuffix = 'playersoverview';
          break;
        case KeyboardNavigation.HAND:
          idSuffix = 'hand';
          break;
        default:
          return;
        }
        const el = document.getElementById('shortkey-' + idSuffix);
        if (el) {
          event.preventDefault();
          const scrollingSpeed = PreferencesManager.loadValue('smooth_scrolling') === '1' ? 'smooth' : 'auto';
          el.scrollIntoView({block: 'center', inline: 'center', behavior: scrollingSpeed});
        }
      }
    },
    isPlayerActing: function(player: PlayerModel) : boolean {
      return player.players.length > 1 && player.waitingFor !== undefined;
    },
    getPlayerCssForTurnOrder: (
      player: PlayerModel,
      highlightActive: boolean,
    ): string => {
      const classes = ['highlighter_box'];
      if (highlightActive) {
        if (player.isActive) {
          classes.push('player_is_active');
        }
        classes.push(playerColorClass(player.color, 'bg'));
      }
      return classes.join(' ');
    },
  },
  destroyed: function() {
    window.removeEventListener('keydown', this.navigatePage);
  },
  mounted: function() {
    window.addEventListener('keydown', this.navigatePage);
  },
  template: `
    <div id="player-home"">
        <div v-if="player.phase === 'end'">
            <div class="player_home_block">
                <dynamic-title title="This game is over!" :color="player.color"/>
                <a :href="'/the-end?id='+ player.id" v-i18n>Go to game results</a>
            </div>
        </div>

        <preferences v-trim-whitespace
          :acting_player="isPlayerActing(player)"
          :player_color="player.color"
          :generation="player.generation"
          :heatCubes="player.heatCubes"
          :greeneryCubes="player.greeneryCubes"
          :waterCubes="player.waterCubes"
          :gameOptions = "player.gameOptions"
          :playerNumber = "player.players.length"
          :lastSoloGeneration = "player.lastSoloGeneration">
            <div class="deck-size">{{ player.deckSize }}</div>
        </preferences>

        <div v-if="player.corporationCard">

            <div class="player_home_block">
                <a name="board" class="player_home_anchor"></a>
                <board
                    :spaces="player.spaces"
                    :boardName ="player.gameOptions.boardName"
                    :oceans_count="player.waterCubes"
                    :oxygen_level="player.greeneryCubes"
                    :temperature="player.heatCubes"
                    :shouldNotify="true"
                    id="shortkey-board"></board>

                <div v-if="player.players.length > 1" class="player_home_block--milestones-and-awards">
                    <milestone :milestones_list="player.milestones" />
                    <award :awards_list="player.awards" />
                </div>
            </div>

            <players-overview class="player_home_block player_home_block--players nofloat:" :player="player" v-trim-whitespace id="shortkey-playersoverview"/>

            <div class="player_home_block player_home_block--log player_home_block--hide_log nofloat">
                <log-panel :id="player.id" :players="player.players" :generation="player.generation" :lastSoloGeneration="player.lastSoloGeneration" :color="player.color"></log-panel>
            </div>

            <div class="player_home_block player_home_block--actions nofloat">
                <a name="actions" class="player_home_anchor"></a>
                <dynamic-title title="Actions" :color="player.color"/>
                <waiting-for v-if="player.phase !== 'end'" :players="player.players" :player="player" :settings="settings" :waitingfor="player.waitingFor"></waiting-for>
            </div>

            <div class="player_home_block player_home_block--hand" v-if="player.draftedCards.length > 0">
                <dynamic-title title="Drafted cards" :color="player.color" />
                <div v-for="card in player.draftedCards" :key="card.name" class="cardbox">
                    <Card :card="card"/>
                </div>
            </div>

            <a name="cards" class="player_home_anchor"></a>
            <div class="player_home_block player_home_block--hand" v-if="player.cardsInHand.length > 0" id="shortkey-hand">
                <dynamic-title title="Cards In Hand" :color="player.color" :withAdditional="true" :additional="(player.cardsInHandNbr).toString()" />
                <sortable-cards :playerId="player.id" :cards="player.cardsInHand" />
            </div>

            <div class="player_home_block player_home_block--cards"">
                <div class="hiding-card-button-row">
                    <dynamic-title title="Played Cards" :color="player.color" />
                    <div class="played-cards-filters">
                      <div class="played-cards-count">{{player.playedCards.length.toString()}}</div>
                      <div class="played-cards-selection" v-i18n>deleteme</div>
                    </div>
                    <div class="text-overview">[ toggle cards filters ]</div>
                </div>
                <div v-if="player.corporationCard !== undefined" class="cardbox">
                    <Card :card="player.corporationCard" :actionUsed="isCardActivated(player.corporationCard, player)"/>
                </div>

                <stacked-cards class="player_home_block--non_blue_cards" :cards="player.playedCards" ></stacked-cards>
            </div>

        </div>

        <div class="player_home_block player_home_block--setup nofloat"  v-if="!player.corporationCard">

            <div class="player_home_block player_home_block--hand" v-if="player.draftedCards.length > 0">
                <dynamic-title title="Drafted Cards" :color="player.color"/>
                <div v-for="card in player.draftedCards" :key="card.name" class="cardbox">
                    <Card :card="card"/>
                </div>
            </div>

            <template v-if="player.pickedCards.length > 0">
              <dynamic-title title="Your selected cards:" :color="player.color"/>
              <div>
                <div v-for="card in player.pickedCards" :key="card.name" class="cardbox">
                  <Card :card="card"/>
                </div>
              </div>
              <div>
              </div>
            </template>

            <dynamic-title v-if="player.pickedCards === undefined" title="Select initial cards:" :color="player.color"/>
            <waiting-for v-if="player.phase !== 'end'" :players="player.players" :player="player" :settings="settings" :waitingfor="player.waitingFor"></waiting-for>

            <dynamic-title title="Game details" :color="player.color"/>


            <div class="player_home_block" v-if="player.players.length > 1">
                <milestone :milestones_list="player.milestones" />
                <award :awards_list="player.awards" />
            </div>

            <div class="player_home_block player_home_block--turnorder nofloat" v-if="player.players.length>1">
                <dynamic-title title="Turn order" :color="player.color"/>
                <div class="player_item" v-for="(p, idx) in player.players" v-trim-whitespace>
                    <div class="player_name_cont" :class="getPlayerCssForTurnOrder(p, true)">
                        <span class="player_number">{{ idx+1 }}.</span><span class="player_name" :class="getPlayerCssForTurnOrder(p, false)" href="#">{{ p.name }}</span>
                    </div>
                    <div class="player_separator" v-if="idx !== player.players.length - 1">⟶</div>
                </div>
            </div>

            <summary class="accordion-header">
                <div class="is-action">
                    <i class="icon icon-arrow-right mr-1"></i>
                    <span v-i18n>Board</span>
                </div>
            </summary>
            <board :spaces="player.spaces" :boardName ="player.gameOptions.boardName"></board>
        </div>
    </div>
    `,
});
