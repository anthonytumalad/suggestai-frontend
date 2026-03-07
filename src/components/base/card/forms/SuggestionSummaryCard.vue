<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 -translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-2"
  >
    <div
      v-if="summary"
      class="bg-bg-primary rounded border border-border-muted overflow-hidden"
    >

      <!-- ── HEADER ── -->
      <div
        class="flex items-start justify-between gap-4 px-6 py-6"
        :class="{ 'border-b border-border-muted': isExpanded }"
      >

        <!-- Clickable Left Section -->
        <div
          class="flex-1 min-w-0 space-y-2 cursor-pointer select-none hover:bg-bg-muted/30 rounded transition-colors p-2 -m-2"
          @click="isExpanded = !isExpanded"
        >
          <div>
            <p class="text-base font-medium text-text-base truncate">
              {{ summary.session.name }}
            </p>
          </div>

          <!-- Meta row -->
          <div class="flex items-center flex-wrap gap-x-4 gap-y-1">
            <span class="inline-flex items-center gap-1 text-sm text-text-muted">
              <span class="font-semibold text-text-base">
                {{ summary.session.total_topics }}
              </span>
              topics
            </span>

            <span class="w-1 h-1 rounded-full bg-border-muted shrink-0"></span>

            <span class="inline-flex items-center gap-1 text-sm text-text-muted">
              from
              <span class="font-semibold text-text-base">
                {{ summary.session.total_documents }}
              </span>
              documents
            </span>

            <span class="w-1 h-1 rounded-full bg-border-muted shrink-0"></span>

            <span class="inline-flex items-center gap-1 text-sm text-text-muted">
              <span class="font-semibold text-text-base">
                {{ summary.session.outliers }}
              </span>
              outliers
            </span>


            <!-- Status -->
            <span
              v-if="!isSaved"
              class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium uppercase tracking-wide bg-green-50 text-green-700 border border-green-200"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              Unsaved
            </span>

            <span
              v-else
              class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono font-medium uppercase tracking-wide bg-bg-muted text-text-muted border border-border-muted"
            >
              Saved
            </span>

          </div>

        </div>

        <!-- Actions -->
        <div class="flex items-center gap-x-6">

          <div class="flex items-center gap-x-2">
            <BaseButton
              variant="outline"
              label="Clear"
              size="sm"
              @click="$emit('clear')"
            />

            <BaseButton
              variant="primary"
              :icon="IconDeviceFloppy"
              label="Save"
              size="sm"
              :loading="isSaving"
              @click="$emit('save')"
            />
          </div>

          <!-- Expand / Collapse -->
          <!-- <button
            class="text-xs uppercase tracking-wide text-text-muted hover:text-text-base transition-colors"
            @click="isExpanded = !isExpanded"
          >
            {{ isExpanded ? 'Collapse' : 'Expand' }}
          </button> -->

        </div>
      </div>

      <!-- ── BODY ── -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isExpanded"
          class="px-6 pb-6 pt-5 space-y-6"
        >

          <!-- STATS -->
          <div class="grid grid-cols-3 divide-x divide-border-muted border border-border-muted rounded overflow-hidden">
            <div class="flex flex-col gap-1 px-4 py-4 bg-bg-muted/30">
              <span class="text-[10px] uppercase tracking-widest text-text-muted/70">
                Topics found
              </span>
              <span class="text-2xl font-semibold text-text-base leading-none">
                {{ summary.session.total_topics }}
              </span>
              <span class="text-[11px] text-text-muted">
                distinct clusters
              </span>
            </div>

            <div class="flex flex-col gap-1 px-4 py-4 bg-bg-muted/30">
              <span class="text-[10px] uppercase tracking-widest text-text-muted/70">
                Documents
              </span>
              <span class="text-2xl font-semibold text-text-base leading-none">
                {{ summary.session.total_documents }}
              </span>
              <span class="text-[11px] text-text-muted">
                processed
              </span>
            </div>

            <div class="flex flex-col gap-1 px-4 py-4 bg-bg-muted/30">
              <span class="text-[10px] uppercase tracking-widest text-text-muted/70">
                Outliers
              </span>
              <span class="text-2xl font-semibold text-text-base leading-none">
                {{ summary.session.outliers }}
              </span>
              <span class="text-[11px] text-text-muted">
                {{ outlierPercent }}% of total
              </span>
            </div>
          </div>

          <!-- DUPLICATE WARNING -->
          <div
            v-if="duplicateDetected && !isSaved"
            class="rounded-lg border border-yellow-300 bg-yellow-50 p-4 space-y-3"
          >
            <div class="flex items-center gap-2 text-sm font-semibold text-yellow-800">
              <IconAlertTriangle class="w-4 h-4 shrink-0" />
              A session for this date range already exists
            </div>

            <p class="text-xs text-yellow-700/80 font-mono">
              Existing session has
              {{ existingSession?.total_topics }} topics · created
              {{ existingSession?.created_at }}
            </p>

            <div class="flex gap-2">
              <button
                class="px-3 py-1.5 text-xs rounded-md border border-yellow-400 text-yellow-800 hover:bg-yellow-100 transition-colors"
                @click="$emit('save', 'keep_both')"
              >
                Keep both
              </button>

              <button
                class="px-3 py-1.5 text-xs rounded-md bg-yellow-600 text-white hover:bg-yellow-700 transition-colors"
                @click="$emit('save', 'replace')"
              >
                Replace existing
              </button>
            </div>
          </div>

          <!-- TOPICS -->
          <div class="space-y-4">
            <div class="text-[10px] font-mono uppercase tracking-widest text-text-muted/60 border-b border-border-muted pb-2">
              Topics
            </div>

            <div
              v-if="summary.topics.length > 0"
              class="grid gap-3 md:grid-cols-2"
            >
              <TopicCard
                v-for="topic in summary.topics"
                :key="topic.topic_id"
                :topic="topic"
              />
            </div>

            <div
              v-else
              class="text-center py-8 text-text-muted text-sm"
            >
              No topics found in the analysis.
            </div>
          </div>

        </div>
      </Transition>

    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { IconAlertTriangle, IconDeviceFloppy } from '@tabler/icons-vue'
import TopicCard from '../TopicCard.vue'
import type { Topic } from '@/services/forms'

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

const props = defineProps<{
  summary: SessionSummary | null
  totalSuggestions: number
  isSaved?: boolean
  isSaving?: boolean
  duplicateDetected?: boolean
  existingSession?: ExistingSession | null
  dateRange?: {
    start: string
    end: string
  } | null
}>()

defineEmits<{
  clear: []
  save: [action?: 'keep_both' | 'replace']
}>()

const isExpanded = ref(true)

const outlierPercent = computed(() => {
  if (!props.summary) return '0'
  const total = props.summary.session.total_documents
  const outliers = props.summary.session.outliers
  if (!total) return '0'
  return ((outliers / total) * 100).toFixed(1)
})
</script>
