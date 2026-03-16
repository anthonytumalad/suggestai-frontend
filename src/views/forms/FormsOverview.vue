<template>
  <div class="flex flex-col gap-6">
     <div class="flex items-center justify-between gap-4 flex-wrap">

        <div class="flex items-center gap-3 flex-wrap">
          <BaseDropdown width="auto">
            <template #trigger="{ open }">
              <button
                class="flex items-center gap-2 text-sm border border-border-muted rounded px-3 py-1.5 text-text-base hover:border-primary transition-colors duration-150 focus:outline-none"
              >
                <span>
                  {{ selectedSession
                    ? formatDateRange(selectedSession.date_range)
                    : 'Select a session' }}
                </span>
                <IconChevronDown
                  class="w-4 h-4 text-text-muted transition-transform duration-150"
                  :class="{ 'rotate-180': open }"
                />
              </button>
            </template>

            <template v-if="sessions.length">
              <DropdownItem
                v-for="s in sessions"
                :key="s.id"
                :label="formatDateRange(s.date_range)"
                @click="selectedSessionId = s.id"
              />
            </template>

            <div
              v-else
              class="px-3 py-4 text-xs text-text-muted text-center"
            >
              No sessions available
            </div>
          </BaseDropdown>

          <div
            v-if="selectedSession"
            class="flex items-center gap-3 text-xs text-text-muted"
          >
            <span class="w-1 h-1 rounded-full bg-border-muted" />
            <span>Created at {{ formatDate(selectedSession.created_at) }}</span>
          </div>
        </div>
      </div>

    <BaseAlert
      v-if="!sessions.length && !isLoadingSessions"
      severity="warn"
      message="No sessions found. Generate a summary from the Suggestions tab first."
      :closable="false"
    />

    <div
      v-else-if="!selectedSessionId"
      class="bg-bg-primary rounded border border-border-muted px-6 py-16 text-center text-sm text-text-muted"
    >
      Select a session above to view its visualization.
    </div>

    <template v-else>
      <template v-if="isLoading">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            v-for="i in 4"
            :key="i"
            class="h-24 bg-bg-muted animate-pulse rounded border border-border-muted"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="i in 4"
            :key="i"
            class="h-80 bg-bg-muted animate-pulse rounded border border-border-muted"
          />
        </div>
      </template>

      <template v-else>
        <div
          v-if="stats"
          class="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <StatCard label="Total Topics" :value="stats.total_topics" />
          <StatCard label="Total Suggestion" :value="stats.total_documents" />
          <StatCard
            label="Outliers"
            :value="`${stats.outliers} (${stats.outlier_percent}%)`"
          />
          <StatCard label="Avg Topic Size" :value="stats.avg_topic_size" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChartCard
            title="Topic Distribution"
            subtitle="Documents per topic"
          >
            <TopicBarChart
              v-if="distribution"
              :data="distribution.data"
            />
          </ChartCard>

          <ChartCard
            title="Coverage"
            subtitle="Clustered vs outlier documents"
          >
            <TopicDonutChart
              v-if="stats"
              :clustered="stats.total_documents - stats.outliers"
              :outliers="stats.outliers"
            />
          </ChartCard>

          <ChartCard
            title="Keyword Map"
            subtitle="Topic keywords weighted by relevance"
            class="md:col-span-2"
          >
            <TopicKeywordTreemap
              v-if="keywords.length"
              :topics="keywords"
            />
          </ChartCard>

          <ChartCard
            title="Activity Timeline"
            subtitle="Suggestion volume per topic over time"
            class="md:col-span-2"
          >
            <TopicTimeline
              v-if="timeline.length"
              :topics="timeline"
            />
          </ChartCard>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTopicSessions } from '@/composables/forms/useTopicSessions'
import { useTopicVisualization } from '@/composables/forms/useTopicVisualization'
import { IconChevronDown } from '@tabler/icons-vue'
import StatCard from '@/components/viz/StatCard.vue'
import ChartCard from '@/components/viz/ChartCard.vue'
import TopicBarChart from '@/components/viz/TopicBarChart.vue'
import TopicDonutChart from '@/components/viz/TopicDonutChart.vue'
import TopicKeywordTreemap from '@/components/viz/TopicKeywordTreemap.vue'
import TopicTimeline from '@/components/viz/TopicTimeline.vue'

const route = useRoute()
const formId = parseInt(route.params.id as string)

const { sessions, isLoading: isLoadingSessions } =
  useTopicSessions({ formId })

const selectedSessionId = ref<number | null>(null)

watch(
  sessions,
  (val) => {
    const first = val[0]
    if (first && !selectedSessionId.value) {
      selectedSessionId.value = first.id
    }
  },
  { immediate: true }
)

const selectedSession = computed(
  () =>
    sessions.value.find(
      (s) => s.id === selectedSessionId.value
    ) ?? null
)

const { stats, distribution, keywords, timeline, isLoading } =
  useTopicVisualization({
    formId,
    sessionId: selectedSessionId
  })

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(date))

const formatDateRange = (
  range: { start: string | null; end: string | null }
) => {
  if (!range?.start && !range?.end) return 'All dates'
  if (range.start && range.end)
    return `${formatDate(range.start)} – ${formatDate(range.end)}`
  if (range.start) return `From ${formatDate(range.start)}`
  return `Until ${formatDate(range.end!)}`
}
</script>
