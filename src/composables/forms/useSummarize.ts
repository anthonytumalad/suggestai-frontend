import { ref, computed } from 'vue'
import { FormService } from '@/services/formService'
import type { AnalyzeTopicsResponse, SaveTopicSessionResponse } from '@/services/formService'
import { isAxiosError } from 'axios'
import type { ApiErrorResponse } from '@/api'

interface DateRange {
  start: Date | null
  end: Date | null
}

function toParams(dateRange: DateRange) {
  return {
    start_date: dateRange.start ? dateRange.start.toISOString().split('T')[0] : undefined,
    end_date:   dateRange.end   ? dateRange.end.toISOString().split('T')[0]   : undefined,
  }
}

function extractErrorMessage(err: unknown): string {
  if (isAxiosError<ApiErrorResponse>(err)) {
    return (
      err.response?.data?.message ||
      err.message                 ||
      'Request failed'
    )
  }
  if (err instanceof Error) return err.message
  return 'An unexpected error occurred'
}

export function useSummarize() {
  const isSummarizing  = ref(false)
  const isSaving       = ref(false)
  const error          = ref<string | null>(null)

  const analyzeResult  = ref<AnalyzeTopicsResponse | null>(null)

  const savedResult    = ref<SaveTopicSessionResponse | null>(null)

  const analyzeTopics = async (formId: number, dateRange: DateRange) => {
    isSummarizing.value = true
    error.value         = null
    analyzeResult.value = null
    savedResult.value   = null

    try {
      const response      = await FormService.analyzeTopics(formId, toParams(dateRange))
      analyzeResult.value = response
      return response
    } catch (err: unknown) {
      error.value = extractErrorMessage(err)
      throw err
    } finally {
      isSummarizing.value = false
    }
  }


  const saveTopicSession = async (
    formId: number,
    dateRange: DateRange,
    options: { session_name?: string; action?: 'keep_both' | 'replace' } = {}
  ) => {
    isSaving.value    = true
    error.value       = null
    savedResult.value = null

    try {
      const response    = await FormService.saveTopicSession(formId, {
        ...toParams(dateRange),
        ...options,
      })
      savedResult.value = response
      return response
    } catch (err: unknown) {
      error.value = extractErrorMessage(err)
      throw err
    } finally {
      isSaving.value = false
    }
  }

  const previewTopics = computed(() => analyzeResult.value?.preview.topics ?? [])

  const duplicateDetected = computed(() => analyzeResult.value?.duplicate_detected ?? false)

  const existingSession = computed(() => analyzeResult.value?.comparison?.existing_session ?? null)

  const savedSession = computed(() => savedResult.value?.data ?? null)

  const reset = () => {
    analyzeResult.value = null
    savedResult.value   = null
    error.value         = null
  }

  return {
    analyzeTopics,
    saveTopicSession,
    reset,

    isSummarizing,
    isSaving,

    error,

    analyzeResult,
    savedResult,
    previewTopics,
    duplicateDetected,
    existingSession,
    savedSession,
  }
}
