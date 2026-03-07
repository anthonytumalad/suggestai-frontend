<template>
  <div class="flex flex-col gap-1 px-4 py-4 bg-bg-muted/30 rounded border border-border-muted">
    <span class="text-[10px] uppercase text-text-muted">{{ label }}</span>
    <span class="text-2xl font-medium text-text-base leading-none">{{ value }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string; value: string | number }>()
</script>
