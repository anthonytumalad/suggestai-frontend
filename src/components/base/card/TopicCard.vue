<template>
  <div class="bg-bg-secondary rounded p-4 bg-bg-muted">
    <div class="flex items-start justify-between mb-3">
      <div class="flex items-center justify-between">
        <h4 class="font-semibold text-text-base mb-1">{{ topic.label }}</h4>
        <p class="text-xs text-text-muted">
          {{ topic.document_count }} suggestions
          <!-- Score: {{ (topic.representation_score * 100).toFixed(1) }}% -->
        </p>
      </div>
    </div>

    <div class="flex flex-wrap gap-2">
      <span
        v-for="keyword in topic.keywords"
        :key="keyword"
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-bg-muted text-text-base"
      >
        {{ keyword }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
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
