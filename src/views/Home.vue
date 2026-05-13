<template>
  <div class="home-container">
    <app-header />
    <main class="main-content">
      <detect-section />
    </main>
    <app-footer />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useWordLibStore } from '@/stores/wordLib'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import DetectSection from '@/components/DetectSection.vue'

const wordLibStore = useWordLibStore()

onMounted(() => {
  wordLibStore.syncWordLib()
})
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: var(--spacing-xl) 0;
}
</style>