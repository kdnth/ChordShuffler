<script setup lang="ts">
import { Note, Quality } from '@/chords';
import type { Chord } from '@/chords';
import ChordCard from '@/components/ChordCard.vue';
import HomeHero from '@/components/HomeHero.vue';
import PauseButton from '@/components/PauseButton.vue';
import PlayButton from '@/components/PlayButton.vue';
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
  <HomeHero />
  <div class="m-6 flex-col">
    <p v-if="!isPaused">Next chord in {{ countdown }}...</p>
    <ChordCard class="my-2" :chord="current_chord" />

    <div class="flex justify-start gap-4">
      <PlayButton :disabled="!isPaused" @click="shuffleChords" />
      <PauseButton :disabled="isPaused" @click="pauseShuffle" />
    </div>
  </div>
</template>
