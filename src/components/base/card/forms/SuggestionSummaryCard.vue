<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 -translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-2"
  >
    <div v-if="summary" class="bg-bg-primary rounded p-6">
      <div class="flex items-start justify-between mb-6">
        <div class="flex items-start space-x-4">
          <div class="flex-1">
            <h3 class="text-lg font-medium text-text-base mb-1">Topic Analysis Complete</h3>
            <p class="text-sm text-text-muted">
              Found <span class="font-medium text-text-base">{{ summary.total_topics }}</span> topics
              from <span class="font-medium text-text-base">{{ totalSuggestions }}</span> suggestions
            </p>
          </div>
        </div>
        <button
          @click="$emit('clear')"
          class="text-text-muted hover:text-text-base transition-colors p-1 hover:bg-bg-muted rounded"
          title="Clear summary"
        >
          <IconX class="w-5 h-5" />
        </button>
      </div>

      <div class="grid gap-4 md:grid-cols-1">
        <TopicCard
          v-for="topic in summary.summary"
          :key="topic.topic"
          :topic="topic"
        />
      </div>

      <div v-if="summary.summary.length === 0" class="text-center py-8 text-text-muted">
        <p>No topics found in the analysis.</p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { IconX } from '@tabler/icons-vue'
import TopicCard from '../TopicCard.vue'
import type { TopicResponse } from '@/services/formService'

defineProps<{
  summary: TopicResponse['data'] | null
  totalSuggestions: number
}>()

defineEmits<{
  clear: []
}>()
</script>
