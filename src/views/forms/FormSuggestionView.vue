<template>
  <div class="flex flex-col space-y-4">

    <BaseAlert v-if="summarizeError" severity="error" title="Analysis Failed" :message="summarizeError"
      @close="clearError" />

    <div class="flex items-center justify-between border-b border-border-muted pb-4">
      <h1 class="text-xl font-medium text-text-base">
        {{ formTitle }}
      </h1>
      <div class="flex items-center space-x-2">
        <BaseButton variant="outline" :icon="IconDownload" size="sm" />
        <BaseButton variant="outline" :icon="IconEdit" size="sm" />
        <BaseButton variant="outline" :icon="IconTrashX" size="sm" />
      </div>
    </div>

    <div class="flex items-center justify-between">
      <div>
        <BaseDatePicker :modelValue="dateFilter" @update:modelValue="handleDateChange" />
      </div>
      <BaseButton variant="primary" :icon="IconSparkles2" size="sm" label="Summarize"
        :disabled="isSummarizing || !suggestions.length" @click="showConfirmDialog = true" />
    </div>

    <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0" leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-2">
      <div v-if="isSummarizing" class="bg-bg-primary rounded p-6">
        <div class="flex items-start space-x-4">
          <div class="shrink-0">
            <div class="relative w-10 h-10">
              <!-- Animated spinner -->
              <IconLoader stroke="2" class="animate-spin text-primary" />
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-text-base text-base font-medium mb-2">
              Summarizing suggestions...
            </h3>
            <p class="text-sm text-text-muted mb-3">
              {{ loadingMessage }}
            </p>
            <div class="flex items-center space-x-2 text-xs text-text-muted">
              <div class="flex space-x-1">
                <span class="inline-block w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                  style="animation-delay: 0ms">
                </span>
                <span class="inline-block w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                  style="animation-delay: 150ms">
                </span>
                <span class="inline-block w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                  style="animation-delay: 300ms">
                </span>
              </div>
              <span>Processing {{ total }} suggestions</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0" leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-2">
      <div v-if="showSummary && displaySummary && !isSummarizing" class="bg-bg-primary rounded-lg p-6">
        <!-- Header -->
        <div class="flex items-start justify-between mb-6">
          <div class="flex items-start space-x-4">
            <IconCircleCheckFilled stroke="2" class="text-green-500 h-6 w-6 shrink-0" />
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-text-base mb-1">Topic Analysis Complete</h3>
              <p class="text-sm text-text-muted">
                Found <span class="font-medium text-text-base">{{ displaySummary.total_topics }}</span> topics
                from <span class="font-medium text-text-base">{{ total }}</span> suggestions
              </p>
            </div>
          </div>
          <button @click="clearSummary"
            class="text-text-muted hover:text-text-base transition-colors p-1 hover:bg-bg-muted rounded"
            title="Clear summary">
            <IconX class="w-5 h-5" />
          </button>
        </div>

        <!-- Topics Grid -->
        <div class="grid gap-4 md:grid-cols-2">
          <div v-for="topic in displaySummary.summary" :key="topic.topic"
            class="bg-white border border-border-muted rounded-lg p-4 hover:shadow-md transition-shadow">
            <!-- Topic Header -->
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <h4 class="font-semibold text-text-base text-base mb-1">
                  {{ topic.label }}
                </h4>
                <p class="text-xs text-text-muted">{{ topic.name }}</p>
              </div>
              <span
                class="ml-3 shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {{ topic.count }} suggestions
              </span>
            </div>

            <!-- Keywords -->
            <div class="flex flex-wrap gap-1.5">
              <span v-for="(keyword, index) in topic.keywords" :key="index"
                class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                {{ keyword }}
              </span>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="displaySummary.summary.length === 0" class="text-center py-8 text-text-muted">
          <p>No topics found in the analysis.</p>
        </div>
      </div>
    </Transition>

    <div class="bg-bg-primary p-6 rounded">
      <div class="flex flex-col space-y-4">
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2 text-sm">
            <span class="text-text-muted">
              Total suggestion:
            </span>
            <span class="font-medium text-text-base">
              {{ total }}
            </span>
          </div>
          <span v-if="dateFilter.start || dateFilter.end" class="text-text-muted text-sm">
            - {{ dateFilter.start ? ` from ${formatDate(dateFilter.start)}` : '' }}{{ dateFilter.end ? ` to
            ${formatDate(dateFilter.end)}` : '' }}
          </span>
        </div>
        <SuggestionTable :suggestion="suggestions" :columns="columns" :query="{ isLoading, isFetching }" :page="page"
          :perPage="perPage" :total="total" @update:page="setPage" @update:perPage="setPerPage"
          @date-change="handleDateChange" />
      </div>
    </div>

    <BaseDialog v-model="showConfirmDialog" title="Confirm" size="lg">
      <div class="space-y-4">
        <div class="flex items-start space-x-4">
          <div class="flex-1">
            <p class="text-base text-text-base">
              Are you sure you want to summarize
              <span class="font-semibold">{{ total }} suggestions</span>?
            </p>
            <p v-if="dateFilter.start || dateFilter.end" class="text-sm text-text-muted mt-2">
              {{ formatDateRange() }}
            </p>
          </div>
        </div>
      </div>

      <template #footer>
        <BaseButton variant="outline" size="sm" label="Cancel" @click="showConfirmDialog = false" />
        <BaseButton variant="primary" size="sm" label="Yes, summarize" :loading="isSummarizing"
          @click="handleConfirmSummarize" />
      </template>
    </BaseDialog>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSuggestions } from '@/composables/forms/useSuggestion'
import { useSummarize } from '@/composables/forms/useSummarize'
import { useSummaryStore } from '@/stores/summaryStore'
import SuggestionTable from '@/components/base/table/forms/SuggestionTable.vue'
import { IconDownload, IconEdit, IconTrashX, IconLoader, IconSparkles2, IconCircleCheckFilled, IconX } from '@tabler/icons-vue'
import type { TopicResponse } from '@/services/formService'

const route = useRoute()
const summaryStore = useSummaryStore()

const formId = parseInt(route.params.id as string)
const formTitle = ref<string>(route.query.title as string)

const columns = [
  { key: 'id', label: '#', sortable: false },
  { key: 'student', label: 'Student', slot: true, sortable: true },
  { key: 'suggestion', label: 'Suggestion', sortable: false },
  { key: 'created_at', label: 'Date', sortable: true, slot: true },
]

const {
  suggestions,
  total,
  isLoading,
  isFetching,
  page,
  perPage,
  setPage,
  setPerPage,
  setDateRange,
} = useSuggestions({ formId })

const {
  summarizeTopics,
  isSummarizing,
  error: summarizeError,
  data: summaryData,
  isSuccess
} = useSummarize()

const dateFilter = ref<{ start: Date | null; end: Date | null }>({ start: null, end: null })
const showConfirmDialog = ref(false)

type TopicData = TopicResponse['data']
const displaySummary = ref<TopicData | null>(null)
const showSummary = ref(false)

onMounted(() => {
  const saved = summaryStore.getSummary(formId)
  if (saved) {
    displaySummary.value = saved.data
    showSummary.value = true
    dateFilter.value = {
      start: saved.dateFilter.start ? new Date(saved.dateFilter.start) : null,
      end: saved.dateFilter.end ? new Date(saved.dateFilter.end) : null
    }
  }
})

watch(summaryData, (newData) => {
  if (newData && isSuccess.value) {
    displaySummary.value = newData
    showSummary.value = true
    summaryStore.setSummary(formId, newData, dateFilter.value)
  }
})

const loadingMessages = [
  'Embedding documents with transformer models...',
  'Reducing dimensionality for topic discovery...',
  'Clustering embeddings into latent topics...',
  'Extracting representative keywords per topic...',
  'Refining topic representations...'
]

const loadingMessageIndex = ref(0)
const loadingMessage = computed(() => loadingMessages[loadingMessageIndex.value])

let messageInterval: number | null = null

watch(isSummarizing, (isLoading) => {
  if (isLoading) {
    loadingMessageIndex.value = 0
    messageInterval = setInterval(() => {
      loadingMessageIndex.value = (loadingMessageIndex.value + 1) % loadingMessages.length
    }, 2000)
  } else {
    if (messageInterval) {
      clearInterval(messageInterval)
      messageInterval = null
    }
  }
})

const handleDateChange = (value: { start: Date | null; end: Date | null }) => {
  dateFilter.value = value
  setDateRange(value)
  showSummary.value = false
  displaySummary.value = null
}

const handleConfirmSummarize = async () => {
  showConfirmDialog.value = false

  try {
    await summarizeTopics(formId, dateFilter.value)
  } catch (err) {
    console.error('Summarization failed:', err)
  }
}

const clearError = () => {
  summarizeError.value = null
}

const clearSummary = () => {
  showSummary.value = false
  displaySummary.value = null
  summaryStore.clearSummary(formId)
}

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

const formatDateRange = (): string => {
  const parts: string[] = []
  if (dateFilter.value.start) {
    parts.push(formatDate(dateFilter.value.start))
  }
  if (dateFilter.value.end) {
    parts.push(formatDate(dateFilter.value.end))
  }
  return parts.join(' to ')
}
</script>
