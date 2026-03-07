import { ref, computed } from 'vue'
import { useSummarize } from '@/composables/forms/useSummarize'
import { useSummaryStore } from '@/stores/summaryStore'
import type { StoredSession } from '@/stores/summaryStore'

// --- types ---

interface DateRange {
  start: Date | null
  end: Date | null
}

interface SnapshotDateRange {
  start: string
  end: string
}

// --- helpers ---

const formatShort = (d: Date) =>
  d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const toDateLabel = (snapshot: SnapshotDateRange) =>
  ` · ${formatShort(new Date(snapshot.start))} – ${formatShort(new Date(snapshot.end))}`

const toSnapshot = (range: DateRange): SnapshotDateRange | null =>
  range.start && range.end
    ? { start: range.start.toISOString(), end: range.end.toISOString() }
    : null

// --- composable ---

export function useSuggestionSummary(formId: number) {
  const summaryStore = useSummaryStore()
  const {
    analyzeTopics,
    saveTopicSession,
    reset,
    isSummarizing,
    isSaving,
    error: summarizeError,
    warning: summarizeWarning,
    analyzeResult,
    savedResult,
    duplicateDetected,
    existingSession,
  } = useSummarize()

  const persisted = summaryStore.getSummary(formId)

  const restoredSummary  = ref<StoredSession | null>(persisted?.summary ?? null)
  const restoredIsSaved  = ref(persisted?.summary?.isSaved ?? false)
  const summaryDateRange = ref<SnapshotDateRange | null>(
    persisted?.dateFilter?.start && persisted?.dateFilter?.end
      ? { start: persisted.dateFilter.start, end: persisted.dateFilter.end }
      : null
  )
  const dateFilter = ref<DateRange>({
    start: persisted?.dateFilter?.start ? new Date(persisted.dateFilter.start) : null,
    end:   persisted?.dateFilter?.end   ? new Date(persisted.dateFilter.end)   : null,
  })

  // --- computed ---

  const liveDisplaySummary = computed<StoredSession | null>(() => {
    const label = summaryDateRange.value ? toDateLabel(summaryDateRange.value) : ''

    if (savedResult.value?.data) {
      const { session, topics } = savedResult.value.data
      return {
        session: { ...session, name: session.name + label },
        topics,
        isSaved: true,
      }
    }

    if (analyzeResult.value?.preview) {
      const { preview: p, meta: m } = analyzeResult.value
      return {
        session: {
          id:              0,
          name:            m.form_title + label,
          total_topics:    p.total_topics,
          total_documents: p.total_documents,
          outliers:        p.outliers,
          created_at:      new Date().toISOString(),
        },
        topics: p.topics.map((t, i) => ({ id: i, ...t })),
        isSaved: false,
      }
    }

    return null
  })

  const displaySummary      = computed<StoredSession | null>(() => liveDisplaySummary.value ?? restoredSummary.value)
  const showSaved           = computed(() => savedResult.value !== null || restoredIsSaved.value)
  const dateRangeForDisplay = computed(() => summaryDateRange.value)

  // --- actions ---

  const handleSummarize = async () => {
    reset()
    restoredSummary.value  = null
    restoredIsSaved.value  = false
    summaryDateRange.value = toSnapshot(dateFilter.value)
    summaryStore.clearSummary(formId)

    try {
      await analyzeTopics(formId, dateFilter.value)
      if (liveDisplaySummary.value)
        summaryStore.setSummary(formId, liveDisplaySummary.value, dateFilter.value)
    } catch {
      // error already captured in useSummarize
    }
  }

  const handleSave = async (action?: 'keep_both' | 'replace') => {
    try {
      await saveTopicSession(formId, dateFilter.value, { action })
      if (liveDisplaySummary.value) {
        summaryStore.setSummary(formId, { ...liveDisplaySummary.value, isSaved: true }, dateFilter.value)
        restoredIsSaved.value = true
      }
    } catch {
      // error already captured in useSummarize
    }
  }

  const clearSummary = () => {
    reset()
    restoredSummary.value  = null
    restoredIsSaved.value  = false
    summaryDateRange.value = null
    summaryStore.clearSummary(formId)
  }

  return {
    dateFilter,
    dateRangeForDisplay,

    displaySummary,
    showSaved,
    duplicateDetected,
    existingSession,

    isSummarizing,
    isSaving,
    summarizeError,
    summarizeWarning,

    handleSummarize,
    handleSave,
    clearSummary,
    clearError:   () => { summarizeError.value = null },
    clearWarning: () => { summarizeWarning.value = null },
  }
}
