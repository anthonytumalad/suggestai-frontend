import { ref, computed } from 'vue'
import { useSummarize } from '@/composables/forms/useSummarize'
import { useSummaryStore } from '@/stores/summaryStore'
import type { StoredSession } from '@/stores/summaryStore'

interface DateRange {
  start: Date | null
  end: Date | null
}

export function useSuggestionSummary(formId: number) {
  const summaryStore = useSummaryStore()

  const {
    analyzeTopics,
    saveTopicSession,
    reset,
    isSummarizing,
    isSaving,
    error: summarizeError,
    analyzeResult,
    savedResult,
    duplicateDetected,
    existingSession,
  } = useSummarize()

  const persisted = summaryStore.getSummary(formId)

  const restoredSummary = ref<StoredSession | null>(
    persisted?.summary ?? null
  )
  const restoredIsSaved = ref<boolean>(
    persisted?.summary?.isSaved ?? false
  )
  const dateFilter = ref<DateRange>({
    start: persisted?.dateFilter?.start ? new Date(persisted.dateFilter.start) : null,
    end:   persisted?.dateFilter?.end   ? new Date(persisted.dateFilter.end)   : null,
  })

  const liveDisplaySummary = computed<StoredSession | null>(() => {
    if (savedResult.value?.data) {
      return {
        session: savedResult.value.data.session,
        topics:  savedResult.value.data.topics,
        isSaved: true,
      }
    }

    if (analyzeResult.value?.preview) {
      const p = analyzeResult.value.preview
      const m = analyzeResult.value.meta
      return {
        session: {
          id:              0,
          name:            m.form_title,
          total_topics:    p.total_topics,
          total_documents: p.total_documents,
          outliers:        p.outliers,
          created_at:      new Date().toISOString(),
        },
        topics: p.topics.map((t, i) => ({
          id:                   i,
          topic_id:             t.topic_id,
          label:                t.label,
          document_count:       t.document_count,
          representation_score: t.representation_score,
          keywords:             t.keywords,
        })),
        isSaved: false,
      }
    }

    return null
  })

  const displaySummary = computed<StoredSession | null>(
    () => liveDisplaySummary.value ?? restoredSummary.value
  )

  const showSaved = computed(
    () => savedResult.value !== null || restoredIsSaved.value
  )

  const handleSummarize = async () => {
    restoredSummary.value = null
    restoredIsSaved.value = false

    try {
      await analyzeTopics(formId, dateFilter.value)
      if (liveDisplaySummary.value) {
        summaryStore.setSummary(formId, liveDisplaySummary.value, dateFilter.value)
      }
    } catch { /* error already set in useSummarize */ }
  }

  const handleSave = async (action?: 'keep_both' | 'replace') => {
    try {
      await saveTopicSession(formId, dateFilter.value, { action })
      if (liveDisplaySummary.value) {
        const saved = { ...liveDisplaySummary.value, isSaved: true }
        summaryStore.setSummary(formId, saved, dateFilter.value)
        restoredIsSaved.value = true
      }
    } catch { /* error already set in useSummarize */ }
  }

  const clearSummary = () => {
    reset()
    restoredSummary.value = null
    restoredIsSaved.value = false
    summaryStore.clearSummary(formId)
  }

  const clearError = () => {
    summarizeError.value = null
  }

  const handleDateChange = (value: DateRange) => {
    dateFilter.value = value
    reset()
    restoredSummary.value = null
    restoredIsSaved.value = false
    summaryStore.clearSummary(formId)
  }

  return {
    displaySummary,
    showSaved,
    duplicateDetected,
    existingSession,
    isSummarizing,
    isSaving,
    summarizeError,
    dateFilter,
    handleSummarize,
    handleSave,
    clearSummary,
    clearError,
    handleDateChange,
  }
}
