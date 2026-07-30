<script setup lang="ts">
import type { Chord } from '@/chords';

const props = defineProps<{
  chord: Chord | null;
}>();
</script>
<template>
  <div
    class="rounded-xl min-h-48 bg-blue-500 flex items-center justify-center shadow-sm shadow-neutral-500 border border-blue-300"
  >
    <div v-if="props.chord">
      <h1 class="text-5xl text-white font-black tracking-wide font-body">
        {{ props.chord?.note }}{{ props.chord?.quality }}
      </h1>
    </div>
  </div>
</template>
