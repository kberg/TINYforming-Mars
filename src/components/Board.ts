import Vue from 'vue';
import * as constants from '../constants';
import {BoardSpace} from './BoardSpace';
import {SpaceModel} from '../models/SpaceModel';
import {PreferencesManager} from './PreferencesManager';
// @ts-ignore
import {$t} from '../directives/i18n';
import {SpaceId} from '../boards/ISpace';

class GlobalParamLevel {
  constructor(public value: number, public isActive: boolean, public strValue: string) {
  }
}

class AlertDialog {
    static shouldAlert = true;
}

export const Board = Vue.component('board', {
  props: {
    spaces: {
      type: Array as () => Array<SpaceModel>,
    },
    boardName: {
      type: String,
    },
    heatCubes: {
      type: Number,
    },
    greeneryCubes: {
      type: Number,
    },
    waterCubes: {
      type: Number,
    },
    shouldNotify: {
      type: Boolean,
    },
  },
  components: {
    'board-space': BoardSpace,
  },
  data: function() {
    return {
      'constants': constants,
    };
  },
  mounted: function() {
    if (this.marsIsTerraformed() && this.shouldNotify && AlertDialog.shouldAlert && PreferencesManager.loadValue('show_alerts') === '1') {
      alert('Mars is Terraformed!');
      AlertDialog.shouldAlert = false;
    };
  },
  methods: {
    getAllSpacesOnMars: function(): Array<SpaceModel> {
      const boardSpaces: Array<SpaceModel> = this.spaces;
      boardSpaces.sort(
        (space1: SpaceModel, space2: SpaceModel) => {
          return parseInt(space1.id) - parseInt(space2.id);
        },
      );
      return boardSpaces;
    },
    getSpaceById: function(spaceId: SpaceId) {
      for (const space of this.spaces) {
        if (space.id === spaceId) {
          return space;
        }
      }
      throw 'Board space not found by id \'' + spaceId + '\'';
    },
    getValuesForParameter: function(targetParameter: string): Array<GlobalParamLevel> {
      const values: Array<GlobalParamLevel> = [];
      let startValue: number;
      let curValue: number;

      switch (targetParameter) {
      case 'heat':
        startValue = constants.INITIAL_HEAT_CUBES;
        curValue = this.heatCubes;
        break;
      case 'greenery':
        startValue = constants.INITIAL_GREENERIES;
        curValue = this.greeneryCubes;
        break;
      case 'water':
        startValue = constants.INITIAL_WATER_CUBES;
        curValue = this.waterCubes;
        break;
      default:
        throw `Invalid parameter: ${targetParameter}`;
      }

      for (let value: number = startValue; value >= 0; value -= 1) {
        values.push(new GlobalParamLevel(value, value === curValue, `${value}`));
      }
      return values;
    },
    getScaleCSS: function(paramLevel: GlobalParamLevel): string {
      let css = 'global-numbers-value val-' + paramLevel.value + ' ';
      if (paramLevel.isActive) {
        css += 'val-is-active';
      }
      return css;
    },
    marsIsTerraformed: function() {
      return this.heatCubes === 0 && this.greeneryCubes === 0 && this.waterCubes === 0;
    },
    oceansValue: function() {
      if (this.waterCubes === 0) {
        return '<img width="26" src="/assets/misc/circle-checkmark.png" class="board-ocean-checkmark" :alt="$t(\'Completed!\')">';
      } else {
        return `${this.waterCubes}`;
      }
    },
  },
  template: `
    <div class="board-cont board-without-venus">
    <!--
        <div class="global-numbers">
            <div class="global-numbers-temperature">
                <div :class="getScaleCSS(lvl)" v-for="lvl in getValuesForParameter('temperature')">{{ lvl.strValue }}</div>
            </div>

            <div class="global-numbers-oxygen">
                <div :class="getScaleCSS(lvl)" v-for="lvl in getValuesForParameter('oxygen')">{{ lvl.strValue }}</div>
            </div>

            <div class="global-numbers-oceans" v-html="oceansValue()">
            </div>
        </div>
  -->
        <div class="board" id="main_board">
            <board-space :space="curSpace" :is_selectable="true" :key="'board-space-'+curSpace.id" v-for="curSpace in getAllSpacesOnMars()"></board-space>
            <svg id="board_legend" height="550" width="630" class="board-legend"></svg>
        </div>
    </div>
    `,
});
