<template>
  <input
    :type="type"
    :value="modelValue"
    @input="onInput"
    :placeholder="placeholder"
    :autocomplete="autocomplete"
    :class="mergedInputClass"
    :required="required"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: string
  type?: string
  placeholder?: string
  autocomplete?: string
  required?: boolean
  size?: 'sm' | 'md' | 'lg'
  inputClass?: string
}

const props = withDefaults(defineProps < Props > (), {
  type: 'text',
  size: 'md',
})

const emit = defineEmits < {
  (e: 'update:modelValue', value: string): void
}> ()

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-2 py-1 text-sm'
    case 'lg':
      return 'px-4 py-3 text-lg'
    default:
      return 'px-3 py-2 text-base'
  }
})

const mergedInputClass = computed(() => {
  const base = 'w-full bg-white text-text-base border border-border-muted rounded focus:outline-none focus:ring-1 focus:ring-primary transition'

  return [base, sizeClasses.value, props.inputClass]
    .filter(Boolean)
    .join(' ')
})

const onInput = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>
