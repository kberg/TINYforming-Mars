import Vue from 'vue';
import {Card} from './card/Card';
import {
  ALL_CORPORATION_CARD_NAMES,
  ALL_PROJECT_CARD_NAMES,
  ALL_STANDARD_PROJECT_CARD_NAMES,
} from '../cards/Cards';
import {ICard} from '../cards/ICard';
import {ICardRenderDescription, isIDescription} from '../cards/render/ICardRenderDescription';
import {CardName} from '../CardName';
import {PreferencesManager} from './PreferencesManager';

const cards: Map<CardName, {card: ICard, cardNumber: string}> = new Map();

export interface DebugUIModel {
  filterText: string,
  filterDescription: boolean | unknown[],
  base: boolean | unknown[],
}

export const DebugUI = Vue.component('debug-ui', {
  components: {
    Card,
  },
  data: function() {
    return {
      filterText: '',
      filterDescription: false,
    } as DebugUIModel;
  },
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchString = urlParams.get('search');
    if (searchString) {
      this.filterText = searchString;
    }
  },
  watch: {
    filterText(newSearchString) {
      if (window.history.pushState) {
        const newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?search=' + newSearchString;
        window.history.pushState({path: newurl}, '', newurl);
      }
    },
  },
  methods: {
    sort: function(names: Array<CardName>): Array<CardName> {
      return names.sort();
    },
    getAllStandardProjectCards: function() {
      return this.sort(ALL_STANDARD_PROJECT_CARD_NAMES);
    },
    getAllProjectCards: function() {
      return this.sort(ALL_PROJECT_CARD_NAMES);
    },
    getAllCorporationCards: function() {
      return this.sort(ALL_CORPORATION_CARD_NAMES);
    },
    filtered: function(cardName: CardName): boolean {
      const card = cards.get(cardName);
      const filterText = this.$data.filterText.toUpperCase();
      if (this.$data.filterText.length > 0) {
        if (cardName.toUpperCase().includes(filterText) === false) {
          if (this.$data.filterDescription) {
            let desc: string | ICardRenderDescription | undefined = card?.card.metadata?.description;
            if (isIDescription(desc)) {
              desc = desc.text;
            }
            // TODO(kberg): optimize by having all the descriptions in upper case.
            if (desc === undefined || desc.toUpperCase().includes(filterText) === false) {
              return false;
            }
          } else {
            return false;
          }
        }
      }
      return true;
    },
    getLanguageCssClass() {
      const language = PreferencesManager.loadValue('lang') || 'en';
      return 'language-' + language;
    },
  },
  template: `
        <div class="debug-ui-container" :class="getLanguageCssClass()">
            <h1>Cards List</h1>
            <div class="form-group">
              <input class="form-input form-input-line" placeholder="filter" v-model="filterText"></input>
              <input type="checkbox" name="filterDescription" id="filterDescription-checkbox" v-model="filterDescription"></input>
              <label for="filterDescription-checkbox">
                  <span v-i18n>Filter description</span>
              </label>
            </div>

            <section class="debug-ui-cards-list">
                <h2>Project Cards</h2>
                <div class="cardbox" v-for="card in getAllProjectCards()">
                    <Card v-show="filtered(card)" :card="{'name': card}" />
                </div>
            </section>
            <br>
            <section class="debug-ui-cards-list">
                <h2>Corporations</h2>
                <div class="cardbox" v-for="card in getAllCorporationCards()">
                    <Card v-show="filtered(card)" :card="{'name': card}" />
                </div>
            </section>
            <br>
            <section class="debug-ui-cards-list">
              <h2>Standard Projects</h2>
              <div class="cardbox" v-for="card in getAllStandardProjectCards()">
                  <Card v-show="filtered(card)" :card="{'name': card}" />
              </div>
            </section>
        </div>
    `,
});
