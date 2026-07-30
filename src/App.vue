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
  <div class="px-4 w-full absolute bottom-2 flex justify-between">
    <AppFooter />
    <FloatingMetronome />
  </div>
</template>

<style scoped></style>
