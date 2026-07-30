<script setup lang="ts">
import { watch } from 'vue';
import { useSharedMetronome } from '@/composables/useSharedMetronome';
import PlayButton from '@/components/PlayButton.vue';
import PauseButton from './PauseButton.vue';

const {
  isPlaying,
  pulse,
  bpm,
  meter,
  accents,
  toggle,
  increaseBpm,
  decreaseBpm,
  toggleAccent,
  setMeter
} = useSharedMetronome();

const meterOptions = [
  { label: '2/4', value: 2 },
  { label: '3/4', value: 3 },
  { label: '4/4', value: 4 },
  { label: '5/4', value: 5 },
  { label: '6/8', value: 6 },
  { label: '7/8', value: 7 }
];

function handleMeterChange(event: Event) {
  const value = Number((event.target as HTMLSelectElement).value);
  setMeter(value);
}

watch(pulse, (newPulse) => {
  if (newPulse === 1) {
    console.log('New measure');
  }
});
</script>
<template>
  <div
    class="flex w-full items-center gap-1 overflow-x-auto rounded-full border border-neutral-700 bg-neutral-900 px-3 py-2 text-neutral-200 shadow-lg shadow-black/30 sm:w-fit"
  >
    <PlayButton
      v-if="!isPlaying"
      class="shrink-0 rounded-full border-2 border-neutral-600 text-neutral-300 transition hover:border-blue-400 hover:text-blue-400"
      @click="toggle"
    />
    <PauseButton
      v-if="isPlaying"
      class="shrink-0 rounded-full border-2 border-neutral-600 text-blue-400 transition hover:border-blue-300 hover:text-blue-300"
      @click="toggle"
    />

    <div class="mx-2 flex shrink-0 items-center gap-2 border-l border-neutral-700 pl-3">
      <button
        class="shrink-0 rounded-full border-2 border-neutral-600 px-2 py-1 text-xs font-bold text-neutral-300 transition hover:border-neutral-400 hover:text-white active:scale-95"
        @click="decreaseBpm(5)"
      >
        -5
      </button>
      <span class="flex w-14 shrink-0 flex-col items-center">
        <span class="font-body text-lg font-black text-white">{{ bpm }}</span>
        <span class="text-xs font-semibold uppercase tracking-widest text-neutral-500">bpm</span>
      </span>
      <button
        class="shrink-0 rounded-full border-2 border-neutral-600 px-2 py-1 text-xs font-bold text-neutral-300 transition hover:border-neutral-400 hover:text-white active:scale-95"
        @click="increaseBpm(5)"
      >
        +5
      </button>
    </div>

    <div
      class="mx-2 flex shrink-0 items-center gap-2 border-l border-neutral-700 pl-3 text-xs font-semibold uppercase tracking-wide text-neutral-500"
    >
      Beat <span class="text-neutral-300">{{ pulse }}</span> /
      <select
        aria-label="Meter"
        class="rounded-full border-2 border-neutral-600 bg-neutral-900 px-2 py-1 text-xs font-bold text-neutral-300 focus:border-blue-400 focus:outline-none"
        :value="meter"
        @change="handleMeterChange"
      >
        <option v-for="opt in meterOptions" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
    </div>

    <div class="ml-2 flex shrink-0 items-center gap-1.5 border-l border-neutral-700 pl-3">
      <button
        v-for="(accent, i) in accents"
        :key="i"
        :class="[
          'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition',
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
