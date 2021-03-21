import Vue from 'vue';

import {ICard} from '../../cards/ICard';
import {CardModel} from '../../models/CardModel';
import {CardTitle} from './CardTitle';
import {CardCost} from './CardCost';
import {CardTags} from './CardTags';
import {CardType} from '../../cards/CardType';
import {CardContent} from './CardContent';
import {CardMetadata} from '../../cards/CardMetadata';
import {CardRequirements} from '../../cards/CardRequirements';
import {OwnerModel} from '../../components/SelectCard';
import {MANIFEST} from '../../cards/Cards';
import {ICardFactory} from '../../cards/ICardFactory';


export const Card = Vue.component('card', {
  components: {
    CardTitle,
    CardCost,
    CardTags,
    CardContent,
  },
  props: {
    'card': {
      type: Object as () => CardModel,
      required: true,
    },
    'actionUsed': {
      type: Boolean,
    },
    'owner': {
      type: Object as () => OwnerModel | undefined,
    },
  },
  data: function() {
    let cardInstance: ICard | undefined;
    const cardName = this.card.name;
    const decks = [
      MANIFEST.corporationCards,
      MANIFEST.projectCards,
      MANIFEST.standardProjects,
    ];
    decks.forEach((deck: Array<ICardFactory<any>>) => {
      const factory = deck.find((e) => e.cardName === cardName);
      if (factory !== undefined) {
        cardInstance = new factory.Factory();
      }
    });

    if (cardInstance === undefined) {
      throw new Error(`Can't find card ${cardName}`);
    }

    return {
      cardInstance,
    };
  },
  methods: {
    getCard: function(): ICard | undefined {
      return this.cardInstance;
    },
    getTags: function(): Array<string> {
      let result: Array<string> = [];
      const tags = this.getCard()?.tags;
      if (tags !== undefined) {
        result = result.concat(tags);
      }

      return result;
    },
    getCost: function(): number | undefined {
      const cost = this.getCard()?.cost;
      const type = this.getCardType();
      return cost === undefined || type === 'corp' ? undefined : cost;
    },
    getReducedCost: function(): number | undefined {
      const cost = this.card.calculatedCost;
      const type = this.getCardType();
      return cost === undefined || type === 'corp' ? undefined : cost;
    },
    getCardType: function(): CardType | undefined {
      return this.getCard()?.cardType;
    },
    getCardClasses: function(card: CardModel): string {
      const classes = ['card-container', 'filterDiv', 'hover-hide-res'];
      classes.push('card-' + card.name.toLowerCase().replace(/ /g, '-'));

      if (this.actionUsed) {
        classes.push('card-unavailable');
      }
      if (this.isStandardProject()) {
        classes.push('card-standard-project');
      }
      // IS THIS RIGHT? I MADE IT UP.
      return classes.join(' ');
    },
    getCardMetadata: function(): CardMetadata | undefined {
      return this.getCard()?.metadata;
    },
    getCardRequirements: function(): CardRequirements | undefined {
      return this.getCard()?.requirements;
    },
    isCorporationCard: function() : boolean {
      return this.getCardType() === 'corp';
    },
    isStandardProject: function() : boolean {
      return this.getCardType() === 'standard';
    },
  },
  template: `
        <div :class="getCardClasses(card)">
            <div class="card-content-wrapper" v-i18n>
                <div v-if="!isStandardProject()" class="card-cost-and-tags">
                    <CardCost :amount="getCost()" :newCost="getReducedCost()" />
                    <CardTags :tags="getTags()" />
                </div>
                <CardTitle :title="card.name" :type="getCardType()"/>
                <CardContent v-if="getCardMetadata() !== undefined" :metadata="getCardMetadata()" :requirements="getCardRequirements()" :isCorporation="isCorporationCard()"/>
            </div>
            <CardExtraContent :card="card" />
            <template v-if="owner !== undefined">
              <div :class="'card-owner-label player_translucent_bg_color_'+ owner.color">
                {{owner.name}}
              </div>
            </template>
        </div>
    `,
});
