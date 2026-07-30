<script setup lang="ts">
import { Note, Quality } from '@/chords';
import * as chords from '@/chords';
import type { Chord, Key } from '@/chords';
import ChordCard from '@/components/ChordCard.vue';
import HomeHero from '@/components/HomeHero.vue';
import PauseButton from '@/components/PauseButton.vue';
import PlayButton from '@/components/PlayButton.vue';
import { computed, ref, watch } from 'vue';
import Multiselect from '@vueform/multiselect';
import '@vueform/multiselect/themes/default.css';
import { useSharedMetronome } from '@/composables/useSharedMetronome';
import { SplendidGrandPiano, CacheStorage, Reverb } from 'smplr';
import * as audio from '@/audioUtil';

const metronome = useSharedMetronome();
let context: AudioContext | null = null;
let piano: ReturnType<typeof SplendidGrandPiano> | null = null;
const isLoadingInstrument = ref(false);

type TriggerMode = 'seconds' | 'beats';
const triggerMode = ref<TriggerMode>('seconds');

const isPaused = ref<boolean>(true);
const autoStartedMetronome = ref<boolean>(false);

const current_chord = ref<Chord>({ note: Note.C, quality: Quality.MAJ_7 });

const allQualities: Quality[] = Object.values(Quality);
const selectedQualities = ref<Quality[]>([...allQualities]);

const allNotes: Note[] = chords.allNotes;
const activeKey = ref<Key | null>(null);

const activeNotes = computed<Note[]>(() => {
  if (activeKey.value) {
    return activeKey.value.useFlats ? chords.notesWithFlats : chords.notesWithSharps;
  }
  return allNotes;
});

const keyOptions = computed(() =>
  chords.validKeys.map((key) => ({
    value: key,
    label: `${key.tonic} ${key.type === chords.ScaleType.MAJOR ? '' : 'minor'}`.trim()
  }))
);

const waitSeconds = ref<number>(5);
const waitMs = computed(() => waitSeconds.value * 1000); // 5 seconds
const maxSeconds = 20;

const waitBeats = ref<number>(4);
const maxBeats = 32;

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

const waitForDownbeat = () => {
  return new Promise<void>((resolve) => {
    const stopWatchingPause = watch(isPaused, (paused) => {
      if (paused) cleanup();
    });
    const unsubscribeTick = metronome.onTick((pulse) => {
      if (pulse === 1) cleanup();
    });

    function cleanup() {
      unsubscribeTick();
      stopWatchingPause();
      resolve();
    }
  });
};

const waitForBeats = (beatCount: number) => {
  return new Promise<void>((resolve) => {
    let beatsElapsed = 0;
    countdown.value = beatCount;

    const stopWatchingPause = watch(isPaused, (paused) => {
      if (paused) cleanup();
    });
    const unsubscribeTick = metronome.onTick(() => {
      beatsElapsed += 1;
      countdown.value = beatCount - beatsElapsed;

      if (beatsElapsed >= beatCount) cleanup();
    });

    function cleanup() {
      unsubscribeTick();
      stopWatchingPause();
      resolve();
    }
  });
};

function generate_random_chord(qualities: Quality[]) {
  if (activeKey.value) {
    const diatonicChords: Chord[] = chords.computeKeyArray(activeKey.value);
    const filtered = diatonicChords.filter((chord) => qualities.includes(chord.quality));
    const chordPool = filtered.length > 0 ? filtered : diatonicChords;
    const chord = chordPool[Math.floor(Math.random() * chordPool.length)]!;
    playChord(chord, activeNotes.value);
    return chord;
  } else {
    const chord: Chord = {
      note: activeNotes.value[Math.floor(Math.random() * activeNotes.value.length)]!,
      quality: qualities[Math.floor(Math.random() * qualities.length)]!
    };
    const noteArr: Note[] = chord.note.includes('#')
      ? chords.notesWithSharps
      : chords.notesWithFlats;
    playChord(chord, noteArr);
    return chord;
  }
}

function playChord(chord: Chord, noteArr: Note[]) {
  const chordNoteArr = audio.getChordMidiNoteArray(chord, noteArr);
  piano!.stop();
  chordNoteArr.forEach((note) => {
    piano!.start({
      note,
      time: context!.currentTime,
      duration:
        triggerMode.value === 'seconds'
          ? waitSeconds.value
          : audio.beatsToSeconds(waitBeats.value, metronome.bpm.value),
      velocity: Math.ceil(Math.random() * (120 - 110 + 1)) // random velocity btwn 110-120
    });
  });
}

async function handleChordShuffle() {
  if (triggerMode.value === 'beats') {
    await waitForDownbeat();
  }
  while (isPaused.value == false) {
    current_chord.value = generate_random_chord(selectedQualities.value);
    if (triggerMode.value === 'beats') {
      await waitForBeats(waitBeats.value);
    } else {
      await waitWithCountdown(waitMs.value);
    }
  }
}

async function ensurePiano() {
  if (!context) context = new AudioContext();
  if (context.state === 'suspended') await context.resume();
  if (!piano) {
    let reverb = Reverb(context);
    isLoadingInstrument.value = true;
    piano = SplendidGrandPiano(context, {
      storage: CacheStorage(),
      volume: 38,
      volumeToGain: (db: number) => Math.pow(10, db / 20)
    });
    piano.output.addEffect('reverb', reverb, 0.2);
    await piano.ready;
    isLoadingInstrument.value = false;
  }
}

async function shuffleChords() {
  await ensurePiano();
  isPaused.value = false;
  if (triggerMode.value === 'beats' && !metronome.isPlaying.value) {
    await metronome.start();
    autoStartedMetronome.value = true;
  }
  handleChordShuffle();
}

function pauseShuffle() {
  isPaused.value = true;
  if (autoStartedMetronome.value) {
    metronome.stop();
    autoStartedMetronome.value = false;
  }
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

function handleBeatsInput(event: Event) {
  const target = event.target as HTMLInputElement;
  const value = Number(target.value);

  if (value > maxBeats) {
    waitBeats.value = maxBeats;
  } else {
    waitBeats.value = value;
  }
}
</script>
<template>
  <HomeHero />
  <div class="m-6 flex-col pb-28 sm:pb-24">
    <div
      class="flex flex-wrap items-end gap-6 border-b-2 border-b-gray-200 bg-white py-4 shadow-b-sm"
    >
      <div class="flex flex-col gap-1.5">
        <div class="flex items-center justify-between gap-2">
          <label
            for="qualitySelect"
            class="text-sm font-semibold uppercase tracking-wide text-gray-500"
            >Chord Types</label
          >
          <button
            v-if="selectedQualities.length < allQualities.length"
            type="button"
            class="text-xs font-semibold text-blue-500 hover:text-blue-600"
            @click="selectedQualities = [...allQualities]"
          >
            Select All
          </button>
        </div>
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
        <div class="flex items-center justify-between gap-2">
          <label for="keySelect" class="text-sm font-semibold uppercase tracking-wide text-gray-500"
            >Key (Optional)</label
          >
          <button
            v-if="activeKey"
            type="button"
            class="text-xs font-semibold text-blue-500 hover:text-blue-600"
            @click="activeKey = null"
          >
            Clear
          </button>
        </div>
        <Multiselect
          id="keySelect"
          v-model="activeKey"
          class="quality-select w-full sm:w-72"
          mode="single"
          :options="keyOptions"
          placeholder="Select key"
        />
      </div>
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-semibold uppercase tracking-wide text-gray-500"
          >Shuffle Trigger</label
        >
        <div class="inline-flex rounded-lg border border-gray-300 bg-white p-0.5 shadow-xs">
          <button
            type="button"
            :disabled="!isPaused"
            :class="[
              'rounded-md px-3 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50',
              triggerMode === 'seconds'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            ]"
            @click="triggerMode = 'seconds'"
          >
            Seconds
          </button>
          <button
            type="button"
            :disabled="!isPaused"
            :class="[
              'rounded-md px-3 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50',
              triggerMode === 'beats'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            ]"
            @click="triggerMode = 'beats'"
          >
            Beats
          </button>
        </div>
      </div>
      <div v-if="triggerMode === 'seconds'" class="flex flex-col gap-1.5">
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
            :max="maxSeconds"
            min="1"
            class="w-12 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            @input="handleSecondsInput"
          />
          <span class="text-sm text-gray-500">seconds</span>
        </div>
      </div>
      <div v-else class="flex flex-col gap-1.5">
        <label for="beatsInput" class="text-sm font-semibold uppercase tracking-wide text-gray-500"
          >Shuffle every</label
        >
        <div
          class="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-xs transition focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400/30"
        >
          <input
            id="beatsInput"
            v-model="waitBeats"
            type="number"
            :max="maxBeats"
            min="1"
            class="w-12 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            @input="handleBeatsInput"
          />
          <span class="text-sm text-gray-500">beats</span>
        </div>
      </div>
    </div>
    <p v-if="!isPaused" class="font-body text-purple-400 text-lg mt-4 font-bold">
      Next chord in {{ countdown }} {{ triggerMode === 'beats' ? 'beats' : 'seconds' }}...
    </p>
    <ChordCard class="mb-6 mt-3" :chord="current_chord" />

    <div class="flex justify-start gap-4">
      <PlayButton
        class="text-white bg-green-500 rounded-lg shadow-sm shadow-neutral-700"
        :disabled="!isPaused"
        @click="shuffleChords"
      />
      <PauseButton
        class="text-white bg-red-500 rounded-lg shadow-sm shadow-neutral-700"
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
