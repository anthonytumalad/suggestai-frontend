<template>
  <div class="relative flex items-center">
    <IconSearch class="absolute left-3 h-4 w-4 text-text-muted pointer-events-none shrink-0" />

    <input
      :value="modelValue"
      type="text"
      :placeholder="placeholder"
      :disabled="disabled"
      class="w-full pl-9 pr-8 py-1.5 text-sm bg-bg-primary border-b border-border-muted
             text-text-base placeholder:text-text-muted/60
             focus:outline-none focus:border-primary
             disabled:opacity-50 disabled:cursor-not-allowed
             transition-colors"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @keydown.escape="clear"
    />

    <button
      v-if="modelValue"
      class="absolute right-2.5 text-text-muted hover:text-text-base transition-colors"
      @click="clear"
    >
      <IconX class="h-3.5 w-3.5" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { IconSearch, IconX } from '@tabler/icons-vue'

defineProps<{
  modelValue: string
  placeholder?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'clear': []
}>()

const clear = () => {
  emit('update:modelValue', '')
  emit('clear')
}
</script>
