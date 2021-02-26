const VuexEffects = (store) => ({
  install(VueGlobal) {
    function callActionEffect(vm, stage, action, state, prepend = false) {
      const effectPath = vm.$options.effects.actions;

      // exit if effect's prepend not the same as subscriber
      if (typeof effectPath[action.type] === 'object') {
        if (!!effectPath[action.type].prepend !== prepend) {
          return;
        }
      } else if (typeof effectPath[action.type] === 'function' && prepend) {
        return;
      }

      if (stage === 'before') {
        // if effect is function
        if (typeof effectPath[action.type] === 'function') {
          effectPath[action.type](action, state);
          return;
        }

        // if effect is object and it has handler function
        if (typeof effectPath[action.type] === 'object'
          && typeof effectPath[action.type].handler === 'function') {
          effectPath[action.type].handler(action, state);
        }

        // if effect is object with before function
        if (typeof effectPath[action.type] === 'object'
          && typeof effectPath[action.type][stage] === 'function') {
          effectPath[action.type][stage](action, state);
        }
      } else if (stage === 'after') {
        // if effect is object with after function
        if (typeof effectPath[action.type] === 'object'
          && typeof effectPath[action.type][stage] === 'function') {
          effectPath[action.type][stage](action, state);
        }
      }
    }

    function callMutationEffect(vm, mutation, state, prepend = false) {
      const effectPath = vm.$options.effects.mutations;

      // exit if effect's prepend not the same as subscriber
      if (typeof effectPath[mutation.type] === 'object') {
        if (!!effectPath[mutation.type].prepend !== prepend) {
          return;
        }
      } else if (typeof effectPath[mutation.type] === 'function' && prepend) {
        return;
      }

      // if effect is function
      if (typeof effectPath[mutation.type] === 'function') {
        effectPath[mutation.type](mutation, state);
      }

      // if effect is object and it has handler function
      if (typeof effectPath[mutation.type] === 'object'
        && typeof effectPath[mutation.type].handler === 'function') {
        effectPath[mutation.type].handler(mutation, state);
      }
    }

    VueGlobal.mixin({
      beforeCreate() {
        // action wrapper fn
        const actionFn = (effectActionsList, prepend = false) => ({
          before: (action, state) => {
            if (effectActionsList.includes(action.type)) {
              callActionEffect(this, 'before', action, state, prepend);
            }
          },
          after: (action, state) => {
            if (effectActionsList.includes(action.type)) {
              callActionEffect(this, 'after', action, state, prepend);
            }
          },
        });

        // mutation wrapper fn
        const mutationFn = (effectActionsList, prepend = false) => (mutation, state) => {
          if (effectActionsList.includes(mutation.type)) {
            callMutationEffect(this, mutation, state, prepend);
          }
        };

        const { effects } = this.$options;
        if (effects) {
          const subscribers = [];
          const effectTypes = Object.keys(effects);
          effectTypes.forEach((effectType) => {
            const effectActionsList = Object.keys(effects[effectType]);

            // subscribe to two identical events, with 'prepend' option and without it
            // so we have only two subscriber for all events
            // for actions and mutations
            switch (effectType) {
              case 'actions': {
                subscribers.push(
                  store.subscribeAction(actionFn(effectActionsList)),
                  store.subscribeAction(actionFn(effectActionsList, true), { prepend: true }),
                );
                break;
              }
              case 'mutations': {
                subscribers.push(
                  store.subscribe(mutationFn(effectActionsList)),
                  store.subscribe(mutationFn(effectActionsList, true), { prepend: true }),
                );
                break;
              }
              default: {
                throw new Error(`[vuex-effects] Unrecognized effect section ${effectType}`);
              }
            }
          });

          this.$once('hook:beforeDestroy', () => {
            subscribers.forEach((subscriber) => subscriber());
          });
        }
      }
    });
  }
});

export default VuexEffects;
