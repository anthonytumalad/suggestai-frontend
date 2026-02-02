<template>
  <div class="flex justify-center items-center">
    <div class="flex flex-col items-center space-y-4">
      <div class="flex items-center space-x-2">
        <IconMoodPuzzled size={8} stroke={2} class="text-text-muted" />
        <h1 class="text-6xl text-text-muted">404</h1>
      </div>
      <p class="text-lg text-text-base">This is not the webpage you looking for.</p>
      <BaseButton label="Back to dashboard" size="sm" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconMoodPuzzled } from '@tabler/icons-vue'
</script>
