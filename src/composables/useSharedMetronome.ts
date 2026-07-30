import { inject, type InjectionKey } from 'vue';
import type { UseMetronomeReturn } from 'metronome-core/vue';

export const METRONOME_KEY: InjectionKey<UseMetronomeReturn> = Symbol('metronome');

export function useSharedMetronome(): UseMetronomeReturn {
  const metronome = inject(METRONOME_KEY);
  if (!metronome) {
    throw new Error('useSharedMetronome() requires the metronome to be provided (see App.vue)');
  }
  return metronome;
}
