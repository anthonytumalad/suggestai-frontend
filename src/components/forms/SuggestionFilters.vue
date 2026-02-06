<template>
  <div class="flex items-center justify-between">
    <BaseDatePicker
      :modelValue="dateFilter"
      @update:modelValue="$emit('update:dateFilter', $event)"
    />
    <BaseButton
      variant="primary"
      :icon="IconSparkles2"
      size="sm"
      label="Summarize"
      :disabled="disabled"
      @click="$emit('summarize')"
    />
  </div>
</template>

<script setup lang="ts">
import { IconSparkles2 } from '@tabler/icons-vue'

defineProps<{
  dateFilter: { start: Date | null; end: Date | null }
  disabled: boolean
}>()

defineEmits<{
  'update:dateFilter': [value: { start: Date | null; end: Date | null }]
  summarize: []
}>()
</script>
