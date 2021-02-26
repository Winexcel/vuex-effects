# vuex-effects

Effects is a side effect model for Vuex. Effects use subscribers to provide new sources of actions such as network requests, web socket messages and time-based events.

- [Basic example](https://qk441m1kmq.codesandbox.io/)

## Installation

```bash
$ npm install vuex-effects
```

## Usage

Import Plugin
```js
import VuexEffects from "vuex-effects";

Vue.use(VuexEffects(store));
```

Use this in component

```js
import { mapActions, mapState } from 'vuex';

export default {
  name: 'App',
  effects: {
    actions: {
      getTasksList: {
        after(action, state) {
          localStorage.setItem('tasksList', JSON.stringify(this.tasksList));
        }
      }
    }
  },
  computed: {
    ...mapState(['tasksList']),
  },
  mounted() {
    this.getTasksList();
  },
  methods: {
    ...mapActions(['getTasksList']),
  },
};
```
