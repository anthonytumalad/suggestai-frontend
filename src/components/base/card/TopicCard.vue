<template>
  <div class="bg-bg-muted rounded p-4">
    <div class="grid gap-4">
      <!-- Topic Header -->
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <h4 class="font-medium text-text-base text-sm">
            {{ topic.label }}
          </h4>
          <p class="text-xs text-text-muted">{{ topic.name }}</p>
        </div>
        <span
          class="shrink-0 inline-flex items-center text-xs font-medium text-primary"
        >
          {{ topic.count }} suggestions
        </span>
      </div>

      <!-- Keywords -->
      <div class="flex flex-wrap gap-1.5">
        <span
          v-for="(keyword, index) in topic.keywords"
          :key="index"
          class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
        >
          {{ keyword }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TopicResponse } from '@/services/formService'

type Topic = TopicResponse['data']['summary'][number]

defineProps<{
  topic: Topic
}>()
</script>
