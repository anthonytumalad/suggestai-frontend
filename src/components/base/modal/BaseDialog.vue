<template>
  <Teleport
    to="body"
  >
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        @click="handleBackdropClick"
      >
        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="modelValue"
            :class="[
              'relative bg-bg-primary rounded shadow max-h-[90vh] flex flex-col',
              sizeClasses[size]
            ]"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="title ? 'dialog-title' : undefined"
            @click.stop
          >
            <!-- Header -->
            <div
              v-if="title || showClose"
              class="flex items-center justify-between p-4"
            >
              <h2
                v-if="title"
                id="dialog-title"
                class="text-base text-text-base"
              >
                {{ title }}
              </h2>
              <button
                v-if="showClose"
                type="button"
                class="ml-auto text-text-muted cursor-pointer hover:text-text-base transition-colors duration-300"
                @click="handleClose"
                aria-label="Close dialog"
              >
                <IconX stroke="2" class="w-5 h-5" />
              </button>
            </div>

            <!-- Content -->
            <div
              class="flex-1 overflow-y-auto p-6"
            >
              <slot />
            </div>

            <!-- Footer -->
            <div
              v-if="$slots.footer"
              class="flex items-center justify-end space-x-4 p-4"
            >
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { IconX } from '@tabler/icons-vue'

export interface DialogProps {
  modelValue: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showClose?: boolean
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
}

const props = withDefaults(defineProps < DialogProps > (), {
  size: 'md',
  showClose: true,
  closeOnBackdrop: true,
  closeOnEscape: true,
})

const emit = defineEmits < {
  'update:modelValue': [value: boolean]
  close: []
} > ()

const sizeClasses: Record<NonNullable<DialogProps['size']>, string> = {
  sm: 'w-full max-w-sm',
  md: 'w-full max-w-md',
  lg: 'w-full max-w-lg',
  xl: 'w-full max-w-xl',
  full: 'w-full max-w-6xl',
}

const handleClose = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    handleClose()
  }
}

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.closeOnEscape && props.modelValue) {
    handleClose()
  }
}

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
)

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  document.body.style.overflow = ''
})
</script>
