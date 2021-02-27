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

Use this in component like this

```js
import { mapActions, mapState } from 'vuex';

export default {
  // ...
  effects: {
    actions: {
      getTasksList: {
        after(action, state) {
          localStorage.setItem('tasksList', JSON.stringify(this.tasksList));
        }
      }
    }
  },
  // ...
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

Use this outside component (global effects) like this
```js
// @/src/store/tasksEffects.js
export default {
  effects: {
    actions: {
      getTasksList: {
        after(action, state) {
          localStorage.setItem('tasksList', JSON.stringify(this.tasksList));
        }
      }
    }
  },
};

```
If your effects is outside component (global effects) then you must include your global effects in second parameter
```js
// main.js
// ...
import VuexEffects from "vuex-effects";
import tasksEffects from '@/store/effets/tasksEffects';
Vue.use(VuexEffects(store, [tasksEffects])); 
// ...
```
## Effect Options
### Actions
By default action effects is called before action dispatched if you pass your effect like a function and receives the action descriptor and current store state as arguments.

Let's look at this example effects:
```js
effects: {
    actions: {
        getTasksList(action, state) {
            // this code invokes BEFORE vuex action has finished 
            localStorage.setItem('tasksList', JSON.stringify(this.tasksList));
        }
    }
}
```

If you want to invoke your effects after vuex action, you must to use object notation like this
```js
effects: {
    actions: {
        getTasksList: {
            before(action, state) {
                // this code invokes BEFORE vuex action has finished 
                localStorage.setItem('tasksListBefore', JSON.stringify(this.tasksList));
            },
            after(action, state) {
                // this code invokes AFTER vuex action has finished 
                localStorage.setItem('tasksListAfter', JSON.stringify(this.tasksList));
            }
        }
    }
}
```

By default, new actions effects is added to the end of the chain, so it will be executed after other effects that were added before. This can be overridden by adding `prepend: true` to options, which will add the handler to the beginning of the chain.

Let's look at this example effects:
```js
effects: {
    actions: {
        getTasksList: {
            prepend: true, // this will add your effects to the beginning of the chain
            after(action, state) {
                // this code invokes AFTER vuex action has finished 
                localStorage.setItem('tasksListAfter', JSON.stringify(this.tasksList));
            }
        }
    }
}
```
You can also use `handler` as an alias for `before`
```js
effects: {
    actions: {
        getTasksList: {
            prepend: true, // this will add your effects to the beginning of the chain
            handler(action, state) { // same as before()
                // this code invokes BEFORE vuex action has finished 
                localStorage.setItem('tasksListAfter', JSON.stringify(this.tasksList));
            }
        }
    }
}
```

### Mutations
Mutations effects is called after every mutation and receives the mutation descriptor and post-mutation state as arguments.

Let's look at this example effects:
```js
effects: {
    mutations: {
        setTasksList(mutation, state) {
            // this code invokes AFTER vuex mutation has finished 
            console.log(mutation.payload)
            console.log(state)
        }
    }
}
```

By default, new mutations effects is added to the end of the chain, so it will be executed after other mutations effects that were added before. This can be overridden by adding `prepend: true` to options, which will add the handler to the beginning of the chain.

Let's look at this example effects:
```js
effects: {
    actions: {
        getTasksList: {
            prepend: true, // this will add your effects to the beginning of the chain
            handler(mutation, state) {
                // this code invokes AFTER vuex mutation has finished 
                localStorage.setItem('tasksListAfter', JSON.stringify(this.tasksList));
            }
        }
    }
}

