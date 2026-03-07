<template>
  <div class="relative" ref="containerRef">
    <div @click="toggle">
      <slot name="trigger" :open="isOpen" />
    </div>

    <Transition
      enter-active-class="transition-all duration-150 ease-out"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-if="isOpen"
        class="absolute z-50 mt-2 bg-bg-primary border border-border-muted rounded shadow overflow-hidden"
        :class="[widthClass, alignClass]"
      >
        <slot :close="close" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = withDefaults(defineProps<{
  align?: 'left' | 'right'
  width?: 'sm' | 'md' | 'lg' | 'auto'
  disabled?: boolean
}>(), {
  align: 'left',
  width: 'md',
  disabled: false,
})

const emit = defineEmits<{
  open:  []
  close: []
}>()

const isOpen       = ref(false)
const containerRef = ref<HTMLElement | null>(null)

const widthClass = computed(() => ({
  sm:   'w-32',
  md:   'w-44',
  lg:   'w-56',
  auto: 'w-auto min-w-full',
}[props.width]))

const alignClass = computed(() =>
  props.align === 'right' ? 'right-0' : 'left-0'
)

const toggle = () => {
  if (props.disabled) return
  isOpen.value ? close() : open()
}

const open = () => {
  isOpen.value = true
  emit('open')
}

const close = () => {
  isOpen.value = false
  emit('close')
}

const handleOutsideClick = (e: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    close()
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') close()
}

onMounted(() => {
  document.addEventListener('mousedown', handleOutsideClick)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleOutsideClick)
  document.removeEventListener('keydown', handleKeydown)
})
</script>
