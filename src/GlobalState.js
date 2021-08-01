import { reactive, provide, inject } from "vue";

const STATE_CONTEXT = Symbol();

export function useGlobalStateProvider(initial_value) {
  const state = reactive(initial_value);
  provide(STATE_CONTEXT, state);
  return state;
}

export function useGlobalState() {
  const context = inject(STATE_CONTEXT);
  if (!context) {
    throw new Error(
      "No state context found. Global state needs a provider initialized before accessed."
    );
  }
  return context;
}
