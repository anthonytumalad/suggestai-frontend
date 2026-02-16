import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface StoredSession {
  session: {
    id: number
    name: string
    total_topics: number
    total_documents: number
    outliers: number
    created_at: string
  }
  topics: Array<{
    id: number
    topic_id: number
    label: string
    document_count: number
    representation_score: number
    keywords: string[]
  }>
  isSaved: boolean
}

interface SummaryData {
  formId: number
  summary: StoredSession
  timestamp: string
  dateFilter: {
    start: string | null
    end: string | null
  }
}

const STORAGE_KEY = 'tlc-summary-store'

export const useSummaryStore = defineStore('summary', () => {
  const loadFromStorage = (): Record<number, SummaryData> => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)

        // Validate the structure
        if (typeof parsed === 'object' && parsed !== null) {
          console.log('📦 Loaded summaries from storage:', Object.keys(parsed))
          return parsed as Record<number, SummaryData>
        }
      }
    } catch (err) {
      console.warn('Failed to load summaries from storage — resetting.', err)
      localStorage.removeItem(STORAGE_KEY)
    }
    return {}
  }

  const summaries = ref<Record<number, SummaryData>>(loadFromStorage())

  const saveToStorage = () => {
    try {
      const data = JSON.stringify(summaries.value)
      localStorage.setItem(STORAGE_KEY, data)
      console.log('💾 Saved summaries to storage:', Object.keys(summaries.value))
    } catch (err) {
      console.error('Failed to persist summaries:', err)
      if (err instanceof DOMException && err.name === 'QuotaExceededError') {
        console.warn('LocalStorage quota exceeded. Consider clearing old data.')
      }
    }
  }

  const setSummary = (
    formId: number,
    summary: StoredSession,
    dateFilter: { start: Date | null; end: Date | null }
  ) => {
    // Ensure isSaved property exists
    const validatedSummary: StoredSession = {
      ...summary,
      isSaved: summary.isSaved ?? false
    }

    summaries.value[formId] = {
      formId,
      summary: validatedSummary,
      timestamp: new Date().toISOString(),
      dateFilter: {
        start: dateFilter.start?.toISOString() ?? null,
        end: dateFilter.end?.toISOString() ?? null,
      },
    }
    saveToStorage()
  }

  const getSummary = (formId: number): SummaryData | undefined => {
    const data = summaries.value[formId]

    // Validate the data structure before returning
    if (data && data.summary && typeof data.summary === 'object') {
      console.log('✅ Found stored summary for form', formId)
      return data
    }

    return undefined
  }

  const clearSummary = (formId: number): void => {
    delete summaries.value[formId]
    saveToStorage()
    console.log('🗑️ Cleared summary for form', formId)
  }

  const clearAll = (): void => {
    summaries.value = {}
    localStorage.removeItem(STORAGE_KEY)
    console.log('🗑️ Cleared all summaries')
  }

  return {
    summaries,
    setSummary,
    getSummary,
    clearSummary,
    clearAll,
  }
})
