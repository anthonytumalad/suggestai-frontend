<template>
  <textarea
    :value="modelValue"
    @input="onInput"
    :placeholder="placeholder"
    :rows="rows"
    :class="mergedClass"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: string
  placeholder?: string
  rows?: number
  size?: 'sm' | 'md' | 'lg'
  inputClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  rows: 3,
  size: 'md',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm': return 'px-2 py-1 text-sm'
    case 'lg': return 'px-4 py-3 text-lg'
    default:   return 'px-3 py-2 text-base'
  }
})

const mergedClass = computed(() => {
  const base = 'w-full bg-white text-text-base border border-border-muted rounded focus:outline-none focus:ring-1 focus:ring-primary transition resize-none'
  return [base, sizeClasses.value, props.inputClass].filter(Boolean).join(' ')
})

const onInput = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
}
</script>
