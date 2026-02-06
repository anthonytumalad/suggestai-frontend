<template>
  <Message
    :severity="severity"
    :closable="closable"
    @close="handleClose"
    :life="life"
    :class="customClass"
  >
    <template #default>
      <div class="flex items-center space-x-4">
        <component
          :is="severityIcon"
          stroke="2"
          class="w-5 h-5 shrink-0"
          :class="{ 'animate-spin': severity === 'secondary' }"
        />
        <div class="flex-1">
          <span
            v-if="title"
            class="block text-base"
          >
            {{ title }}
          </span>
          <span class="text-sm">{{ message }}</span>
        </div>
      </div>
    </template>
  </Message>
</template>

<script setup lang="ts">
import Message from 'primevue/message'
import { computed } from 'vue'
import {
  IconCircleCheck,
  IconInfoCircle,
  IconAlertTriangle,
  IconCircleX,
  IconLoader
} from '@tabler/icons-vue'

interface __Props__ {
  severity?: 'success' | 'info' | 'warn' | 'error' | 'secondary'
  message: string
  title?: string
  closable?: boolean
  life?: number
  customClass?: string
}

const props = withDefaults(defineProps<__Props__>(), {
  severity: 'info',
  closable: true,
  life: 0,
  customClass: ''
})

const emit = defineEmits<{
  close: []
}>()

const severityIcon = computed(() => {
  const iconMap = {
    success: IconCircleCheck,
    info: IconInfoCircle,
    warn: IconAlertTriangle,
    error: IconCircleX,
    secondary: IconLoader
  }
  return iconMap[props.severity]
})

const handleClose = () => {
  emit('close')
}
</script>
