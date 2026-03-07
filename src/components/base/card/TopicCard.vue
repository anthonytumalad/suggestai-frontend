<template>
  <div class="bg-bg-muted/30 border border-border-muted p-4 rounded flex flex-col gap-2">

    <div class="flex items-start justify-between gap-2">
      <div class="flex items-center gap-2 min-w-0">
        <span class="shrink-0 text-sm font-semibold text-primary px-1.5 py-0.5 rounded">
          #{{ topic.topic_id }}
        </span>
        <h4 class="text-sm font-semibold text-text-base truncate">
          {{ topic.label }}
        </h4>
      </div>

      <span class="shrink-0 flex items-center gap-1 text-xs text-text-muted">
        <IconFile stroke={2} class="w-4 h-4" />
        {{ topic.document_count }} suggestions
      </span>
    </div>

    <div class="flex flex-row gap-1">
      <span
        v-for="keyword in topic.keywords"
        :key="keyword"
        class="text-sm text-text-muted"
      >
        {{ keyword }} /
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconFile } from '@tabler/icons-vue'

defineProps<{
  topic: {
    id: number
    topic_id: number
    label: string
    document_count: number
    representation_score: number
    keywords: string[]
  }
}>()
</script>
