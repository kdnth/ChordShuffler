<script setup lang="ts">
import { Note, Quality } from '@/chords';
import type { Chord } from '@/chords';
import ChordCard from '@/components/ChordCard.vue';
import { ref } from 'vue';
// No options yet, just shuffle all chords
function generate_random_chord() {
  const notes: Note[] = Object.values(Note);
  const qualities: Quality[] = Object.values(Quality);

  const chord: Chord = {
    note: notes[Math.floor(Math.random() * notes.length)]!,
    quality: qualities[Math.floor(Math.random() * qualities.length)]!
  };

  return chord;
}

const isPaused = ref<boolean>(true);
const waitMs = ref<number>(5000); // 5 seconds
const current_chord = ref<Chord>({ note: Note.C, quality: Quality.MAJ_7 });

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
    current_chord.value = generate_random_chord();
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
</script>
<template>
  <div class="m-6 flex-col">
    <p v-if="!isPaused">Next chord in {{ countdown }}...</p>
    <ChordCard class="my-2" :chord="current_chord" />

    <div class="flex justify-start gap-4">
      <button
        :disabled="!isPaused"
        class="p-2 rounded-lg bg-black text-white hover:bg-gray-600 disabled:bg-neutral-400"
        @click="shuffleChords"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
          />
        </svg>
      </button>
      <button
        :disabled="isPaused"
        class="p-2 rounded-lg bg-black text-white hover:bg-gray-600 disabled:bg-neutral-400"
        @click="pauseShuffle"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 5.25v13.5m-7.5-13.5v13.5"
          />
        </svg>
      </button>
    </div>
  </div>
</template>
