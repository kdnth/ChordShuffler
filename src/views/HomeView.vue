<script setup lang="ts">
import { Note, Quality } from '@/chords';
import type { Chord } from '@/chords';
import ChordCard from '@/components/ChordCard.vue';
import HomeHero from '@/components/HomeHero.vue';
import PauseButton from '@/components/PauseButton.vue';
import PlayButton from '@/components/PlayButton.vue';
import { computed, ref } from 'vue';
import Multiselect from '@vueform/multiselect';
import '@vueform/multiselect/themes/default.css';

function generate_random_chord(qualities: Quality[]) {
  const notes: Note[] = Object.values(Note);

  const chord: Chord = {
    note: notes[Math.floor(Math.random() * notes.length)]!,
    quality: qualities[Math.floor(Math.random() * qualities.length)]!
  };

  return chord;
}

const isPaused = ref<boolean>(true);
const current_chord = ref<Chord>({ note: Note.C, quality: Quality.MAJ_7 });
const allQualities: Quality[] = Object.values(Quality);
const selectedQualities = ref<Quality[]>([...allQualities]);

const waitSeconds = ref<number>(5);
const waitMs = computed(() => waitSeconds.value * 1000); // 5 seconds
const maxSeconds = 20;

const countdown = ref<number>(waitMs.value / 1000);

const waitWithCountdown = (ms: number) => {
  return new Promise<void>((resolve) => {
    let secondsLeft = Math.ceil(ms / 1000);
    countdown.value = secondsLeft;

    const interval = setInterval(() => {
      if (isPaused.value) {
        clearInterval(interval);
        resolve();
        return;
      }
      secondsLeft -= 1;
      countdown.value = secondsLeft;

      if (secondsLeft <= 0) {
        clearInterval(interval);
        resolve();
      }
    }, 1000);
  });
};

async function handleChordShuffle() {
  while (isPaused.value == false) {
    current_chord.value = generate_random_chord(selectedQualities.value);
    await waitWithCountdown(waitMs.value);
  }
}

function shuffleChords() {
  isPaused.value = false;
  handleChordShuffle();
}

function pauseShuffle() {
  isPaused.value = true;
}

function handleSecondsInput(event: Event) {
  const target = event.target as HTMLInputElement;
  const value = Number(target.value);

  if (value > maxSeconds) {
    waitSeconds.value = maxSeconds;
  } else {
    waitSeconds.value = value;
  }
}
</script>
<template>
  <HomeHero />
  <div class="m-6 flex-col">
    <div
      class="flex flex-wrap items-end gap-6 border-b-2 border-b-gray-200 bg-white py-4 shadow-b-sm"
    >
      <div class="flex flex-col gap-1.5">
        <label
          for="qualitySelect"
          class="text-sm font-semibold uppercase tracking-wide text-gray-500"
          >Chord Types</label
        >
        <Multiselect
          id="qualitySelect"
          v-model="selectedQualities"
          class="quality-select w-full sm:w-72"
          mode="tags"
          :options="allQualities"
          placeholder="Select chord types"
        />
      </div>
      <div class="flex flex-col gap-1.5">
        <label for="waitInput" class="text-sm font-semibold uppercase tracking-wide text-gray-500"
          >Shuffle every</label
        >
        <div
          class="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-xs transition focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400/30"
        >
          <input
            id="waitInput"
            v-model="waitSeconds"
            type="number"
            :max="20"
            min="1"
            class="w-12 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            @input="handleSecondsInput"
          />
          <span class="text-sm text-gray-500">seconds</span>
        </div>
      </div>
    </div>
    <p v-if="!isPaused" class="font-body text-red-400 mt-4">Next chord in {{ countdown }}...</p>
    <ChordCard class="my-6" :chord="current_chord" />

    <div class="flex justify-start gap-4">
      <PlayButton
        class="text-white bg-green-500 rounded-lg"
        :disabled="!isPaused"
        @click="shuffleChords"
      />
      <PauseButton
        class="text-white bg-red-500 rounded-lg"
        :disabled="isPaused"
        @click="pauseShuffle"
      />
    </div>
  </div>
</template>

<style scoped>
.quality-select {
  --ms-radius: 0.5rem;
  --ms-border-color: #d1d5db;
  --ms-border-color-active: #60a5fa;
  --ms-ring-color: rgb(96 165 250 / 0.3);
  --ms-tag-bg: #3b82f6;
  --ms-tag-radius: 0.375rem;
  --ms-option-bg-selected: #3b82f6;
  --ms-option-bg-selected-pointed: #2563eb;
  --ms-option-bg-pointed: #eff6ff;
  --ms-option-color-pointed: #1e3a8a;
}
</style>
