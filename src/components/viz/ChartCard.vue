<template>
  <div class="bg-bg-primary rounded border border-border-muted overflow-hidden">
    <div class="px-5 py-4 border-b border-border-muted">
      <p class="text-sm font-medium text-text-base">{{ title }}</p>
      <p v-if="subtitle" class="text-xs text-text-muted mt-0.5">{{ subtitle }}</p>
    </div>
    <div class="p-5">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; subtitle?: string }>()
</script>
