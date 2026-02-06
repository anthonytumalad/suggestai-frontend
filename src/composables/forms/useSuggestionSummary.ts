import { ref, watch, onMounted } from 'vue'
import { useSummarize } from '@/composables/forms/useSummarize'
import { useSummaryStore } from '@/stores/summaryStore'
import type { TopicResponse } from '@/services/formService'

type TopicData = TopicResponse['data']

export function useSuggestionSummary(formId: number) {
  const summaryStore = useSummaryStore()

  const {
    summarizeTopics,
    isSummarizing,
    error: summarizeError,
    data: summaryData,
    isSuccess
  } = useSummarize()

  const displaySummary = ref<TopicData | null>(null)
  const showSummary = ref(false)
  const dateFilter = ref<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null
  })

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

  const handleSummarize = async () => {
    try {
      await summarizeTopics(formId, dateFilter.value)
    } catch (err) {
      console.error('Summarization failed:', err)
    }
  }

  const clearSummary = () => {
    showSummary.value = false
    displaySummary.value = null
    summaryStore.clearSummary(formId)
  }

  const clearError = () => {
    summarizeError.value = null
  }

  const handleDateChange = (value: { start: Date | null; end: Date | null }) => {
    dateFilter.value = value
    showSummary.value = false
    displaySummary.value = null
  }

  return {
    displaySummary,
    showSummary,
    isSummarizing,
    summarizeError,
    dateFilter,
    handleSummarize,
    clearSummary,
    clearError,
    handleDateChange
  }
}
