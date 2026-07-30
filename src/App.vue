<script setup lang="ts">
import AppFooter from './components/AppFooter.vue';
import FloatingMetronome from './components/FloatingMetronome.vue';
import HomeView from './views/HomeView.vue';
</script>

<template>
  <HomeView />
  <div class="px-4 w-full absolute bottom-2 flex justify-between">
    <AppFooter />
    <FloatingMetronome />
  </div>
</template>

<style scoped></style>
