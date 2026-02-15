<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 -translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-2"
  >
    <div v-if="summary" class="bg-bg-primary rounded p-6 border border-border-muted space-y-6">

      <!-- Header -->
      <div class="flex items-start justify-between">
        <div>
          <h3 class="text-lg font-medium text-text-base">
            {{ isSaved ? 'Topic Modeling Saved' : 'Topic Modeling Preview' }}
          </h3>
          <p class="text-sm text-text-muted mt-0.5">
            Found
            <span class="font-medium text-text-base">{{ summary.session.total_topics }}</span>
            topics from
            <span class="font-medium text-text-base">{{ summary.session.total_documents }}</span>
            suggestions
          </p>
          <p class="text-xs text-text-muted mt-1">{{ summary.session.name }}</p>
        </div>

        <button
          @click="$emit('clear')"
          class="text-text-muted hover:text-text-base transition-colors p-1 hover:bg-bg-muted rounded"
          title="Clear"
        >
          <IconX class="w-5 h-5" />
        </button>
      </div>

      <!-- Duplicate warning -->
      <div
        v-if="duplicateDetected && !isSaved"
        class="rounded border border-yellow-300 bg-yellow-50 p-4 text-sm space-y-3"
      >
        <p class="font-medium text-yellow-800">
          A session for this date range already exists.
        </p>
        <p class="text-yellow-700 text-xs">
          Existing session has {{ existingSession?.total_topics }} topics,
          created {{ existingSession?.created_at }}.
        </p>
        <div class="flex gap-2">
          <button
            class="px-3 py-1.5 text-xs rounded border border-yellow-400 text-yellow-800 hover:bg-yellow-100 transition-colors"
            @click="$emit('save', 'keep_both')"
          >
            Keep both
          </button>
          <button
            class="px-3 py-1.5 text-xs rounded bg-yellow-600 text-white hover:bg-yellow-700 transition-colors"
            @click="$emit('save', 'replace')"
          >
            Replace existing
          </button>
        </div>
      </div>

      <!-- Topics grid -->
      <div class="grid gap-4 md:grid-cols-1">
        <TopicCard
          v-for="topic in summary.topics"
          :key="topic.topic_id"
          :topic="topic"
        />
      </div>

      <div v-if="summary.topics.length === 0" class="text-center py-8 text-text-muted text-sm">
        No topics found in the analysis.
      </div>

      <!-- Save button — only shown on preview, not after save -->
      <div v-if="!isSaved && !duplicateDetected" class="flex justify-end">
        <button
          class="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
          :disabled="isSaving"
          @click="$emit('save')"
        >
          {{ isSaving ? 'Saving...' : 'Save session' }}
        </button>
      </div>

    </div>
  </Transition>
</template>

<script setup lang="ts">
import { IconX } from '@tabler/icons-vue'
import TopicCard from '../TopicCard.vue'
import type { Topic } from '@/services/formService'

interface SessionSummary {
  session: {
    id: number
    name: string
    total_topics: number
    total_documents: number
    outliers: number
    created_at: string
  }
  topics: Topic[]
}

interface ExistingSession {
  id: number
  total_topics: number
  created_at: string
}

defineProps<{
  summary: SessionSummary | null
  totalSuggestions: number
  isSaved?: boolean
  isSaving?: boolean
  duplicateDetected?: boolean
  existingSession?: ExistingSession | null
}>()

defineEmits<{
  clear: []
  save: [action?: 'keep_both' | 'replace']
}>()
</script>
