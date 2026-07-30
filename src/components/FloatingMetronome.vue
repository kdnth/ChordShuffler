<script setup lang="ts">
import { watch } from 'vue';
import { useSharedMetronome } from '@/composables/useSharedMetronome';
import PlayButton from '@/components/PlayButton.vue';
import PauseButton from './PauseButton.vue';

const { isPlaying, pulse, bpm, meter, accents, toggle, increaseBpm, decreaseBpm, toggleAccent } =
  useSharedMetronome();

watch(pulse, (newPulse) => {
  if (newPulse === 1) {
    console.log('New measure');
  }
});
</script>
<template>
  <div
    class="flex w-fit items-center gap-1 rounded-full border border-neutral-700 bg-neutral-900 px-3 py-2 text-neutral-200 shadow-lg shadow-black/30"
  >
    <PlayButton
      v-if="!isPlaying"
      class="rounded-full border-2 border-neutral-600 text-neutral-300 transition hover:border-blue-400 hover:text-blue-400"
      @click="toggle"
    />
    <PauseButton
      v-if="isPlaying"
      class="rounded-full border-2 border-neutral-600 text-blue-400 transition hover:border-blue-300 hover:text-blue-300"
      @click="toggle"
    />

    <div class="mx-2 flex items-center gap-2 border-l border-neutral-700 pl-3">
      <button
        class="rounded-full border-2 border-neutral-600 px-2 py-1 text-xs font-bold text-neutral-300 transition hover:border-neutral-400 hover:text-white active:scale-95"
        @click="decreaseBpm(5)"
      >
        -5
      </button>
      <span class="flex w-14 flex-col items-center">
        <span class="font-body text-lg font-black text-white">{{ bpm }}</span>
        <span class="text-xs font-semibold uppercase tracking-widest text-neutral-500">bpm</span>
      </span>
      <button
        class="rounded-full border-2 border-neutral-600 px-2 py-1 text-xs font-bold text-neutral-300 transition hover:border-neutral-400 hover:text-white active:scale-95"
        @click="increaseBpm(5)"
      >
        +5
      </button>
    </div>

    <div
      class="mx-2 border-l border-neutral-700 pl-3 text-xs font-semibold uppercase tracking-wide text-neutral-500"
    >
      Beat <span class="text-neutral-300">{{ pulse }}</span> / {{ meter }}
    </div>

    <div class="ml-2 flex items-center gap-1.5 border-l border-neutral-700 pl-3">
      <button
        v-for="(accent, i) in accents"
        :key="i"
        :class="[
          'flex h-6 w-6 items-center justify-center rounded-full border-2 text-xs font-bold transition',
          accent
            ? 'border-blue-500 bg-blue-500 text-white'
            : 'border-neutral-600 bg-transparent text-neutral-400 hover:border-neutral-400',
          pulse === i + 1 ? 'ring-2 ring-white/70 ring-offset-2 ring-offset-neutral-900' : ''
        ]"
        @click="toggleAccent(i)"
      >
        {{ i + 1 }}
      </button>
    </div>
  </div>
</template>
