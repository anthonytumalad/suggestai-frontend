import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { TopicResponse } from '@/services/formService'

type TopicData = TopicResponse['data']

interface SummaryData {
  formId: number
  data: TopicData
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
        return parsed
      }
    } catch (error) {
      console.error('Failed to load summaries from storage:', error)
    }
    return {}
  }

  const summaries = ref<Record<number, SummaryData>>(loadFromStorage())

  const saveToStorage = () => {
    try {
      const toSave = JSON.stringify(summaries.value)
      localStorage.setItem(STORAGE_KEY, toSave)
    } catch (error) {
    }
  }

  const setSummary = (
    formId: number,
    data: TopicData,
    dateFilter: { start: Date | null; end: Date | null }
  ) => {
    console.log('Setting summary for formId:', formId)
    summaries.value[formId] = {
      formId,
      data,
      timestamp: new Date().toISOString(),
      dateFilter: {
        start: dateFilter.start?.toISOString() || null,
        end: dateFilter.end?.toISOString() || null
      }
    }
    saveToStorage()
  }

  const getSummary = (formId: number): SummaryData | undefined => {
    const summary = summaries.value[formId]
    return summary
  }

  const clearSummary = (formId: number): void => {
    delete summaries.value[formId]
    saveToStorage()
  }

  return {
    summaries,
    setSummary,
    getSummary,
    clearSummary
  }
})
