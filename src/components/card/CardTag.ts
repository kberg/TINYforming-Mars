import Vue from 'vue';
import {Tag} from '../../cards/Tag';

export const CardTag = Vue.component('CardTag', {
  props: {
    index: {
      type: Number,
      required: true,
      validator: (i) => i < 4,
    },
    type: {
      type: String,
      required: true,
      validator: (type: Tag) => Object.values(Tag).includes(type),
    },
  },
  methods: {
    getClasses: function(): string {
      const classes = ['card-tag'];
      classes.push(`tag-${this.type.toLocaleLowerCase()}`);

      return classes.join(' ');
    },
  },
  template: `
        <div :class="getClasses()" />
    `,
});
