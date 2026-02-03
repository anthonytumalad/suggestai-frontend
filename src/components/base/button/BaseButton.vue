<template>
  <button
    :class="buttonClasses"
    :disabled="props.disabled || props.loading"
    v-bind="$attrs"
  >
     <IconLoader v-if="props.loading" class="animate-spin mr-2 h-5 w-5"/>

     <component v-else-if="props.icon" :is="props.icon" class="mr-2 h-5 w-5" />

     <span v-if="props.label"><slot>{{ props.label }}</slot></span>

    <slot v-else />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'
import { IconLoader } from '@tabler/icons-vue'

interface Props {
  label?: string
  icon?: Component
  loading?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'outline'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'primary',
  loading: false,
  disabled: false
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-2 py-1.5 text-sm'
    case 'lg':
      return 'px-4 py-3 text-lg'
    default:
      return 'px-3 py-2 text-base'
  }
})


const variantClasses = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return 'bg-gray-200 text-gray-800'
    case 'outline':
      return 'border border-border-muted text-text-base'
    default:
      return 'bg-primary text-white'
  }
})

const hoverClasses = computed(() => {
  if (props.disabled || props.loading) return ''

  switch (props.variant) {
    case 'secondary':
      return 'hover:bg-gray-300'
    case 'outline':
      return 'hover:text-primary'
    default:
      return 'hover:opacity-80'
  }
})

const buttonClasses = computed(() => {
  return [
    'inline-flex items-center justify-center rounded transition duration-300',
    sizeClasses.value,
    variantClasses.value,
     hoverClasses.value,
    props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer '
  ].filter(Boolean).join(' ')
})
</script>
