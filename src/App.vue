<script setup lang="ts">
import { provide } from 'vue';
import { useMetronome } from 'metronome-core/vue';
import { METRONOME_KEY } from './composables/useSharedMetronome';
import AppFooter from './components/AppFooter.vue';
import FloatingMetronome from './components/FloatingMetronome.vue';
import HomeView from './views/HomeView.vue';

const metronome = useMetronome({ bpm: 120, meter: 4 });
provide(METRONOME_KEY, metronome);
</script>

<template>
  <HomeView />
  <div
    class="fixed inset-x-0 bottom-0 z-50 flex flex-col gap-2 px-4 py-2 sm:flex-row sm:items-center sm:justify-between"
  >
    <AppFooter />
    <FloatingMetronome />
  </div>
</template>

<style scoped></style>
