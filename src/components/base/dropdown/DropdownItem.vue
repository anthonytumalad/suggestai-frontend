<template>
  <button
    class="w-full flex items-center gap-2 text-left px-3 py-2 text-sm text-text-base
           hover:bg-bg-muted transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    :disabled="disabled"
    @click="emit('click')"
  >
    <component v-if="icon" :is="icon" class="h-4 w-4 text-text-muted shrink-0" />
    <span>{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  label:    string
  icon?:    string
  disabled?: boolean
}>()

const emit = defineEmits<{ click: [] }>()
</script>
