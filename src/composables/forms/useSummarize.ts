import { ref, computed } from 'vue'
import { isAxiosError } from 'axios'
import { formService } from '@/services/forms'
import type { AnalyzeTopicsResponse, SaveTopicSessionResponse } from '@/services/forms'
import type { ApiErrorResponse } from '@/api'

// --- types ---

interface DateRange {
  start: Date | null
  end: Date | null
}

interface SaveOptions {
  session_name?: string
  action?: 'keep_both' | 'replace'
}

// --- helpers ---

function toDateParams(range: DateRange) {
  return {
    start_date: range.start?.toISOString().split('T')[0],
    end_date: range.end?.toISOString().split('T')[0],
  }
}

function extractErrorMessage(err: unknown): string {
  if (isAxiosError<ApiErrorResponse>(err))
    return err.response?.data?.message ?? err.message ?? 'Request failed'
  if (err instanceof Error)
    return err.message
  return 'An unexpected error occurred'
}

async function pollUntilReady(
  formId: number,
  params: { start_date?: string; end_date?: string },
  intervalMs = 3000,
  maxAttempts = 100
): Promise<AnalyzeTopicsResponse> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, intervalMs))
    const status = await formService.getAnalysisStatus(formId, params)
    if (status.status === 'ready') return status as unknown as AnalyzeTopicsResponse
  }
  throw new Error('Analysis timed out. Please try again.')
}


// --- composable ---

export function useSummarize() {
  const isSummarizing = ref(false)
  const isSaving = ref(false)
  const error = ref<string | null>(null)
  const warning = ref<string | null>(null)
  const analyzeResult = ref<AnalyzeTopicsResponse | null>(null)
  const savedResult = ref<SaveTopicSessionResponse | null>(null)

  const analyzeTopics = async (formId: number, dateRange: DateRange) => {
    isSummarizing.value = true
    error.value = null
    warning.value = null
    analyzeResult.value = null
    savedResult.value = null

    const params = toDateParams(dateRange)

    try {
      // kick off the job — capture warning if count is 50–149
      const kickoff = await formService.analyzeTopics(formId, params)
      if (kickoff.warning) warning.value = kickoff.warning

      // poll until ready
      const result = await pollUntilReady(formId, params)
      analyzeResult.value = result
      return result
    } catch (err) {
      error.value = extractErrorMessage(err)
      throw err
    } finally {
      isSummarizing.value = false
    }
  }

  const saveTopicSession = async (formId: number, dateRange: DateRange, options: SaveOptions = {}) => {
    isSaving.value = true
    error.value = null
    savedResult.value = null

    try {
      savedResult.value = await formService.saveTopicSession(formId, {
        ...toDateParams(dateRange),
        ...options,
      })
      return savedResult.value
    } catch (err) {
      error.value = extractErrorMessage(err)
      throw err
    } finally {
      isSaving.value = false
    }
  }

  const reset = () => {
    analyzeResult.value = null
    savedResult.value = null
    error.value = null
    warning.value = null
  }

  return {
    analyzeTopics,
    saveTopicSession,
    reset,

    isSummarizing,
    isSaving,
    error,
    warning,

    analyzeResult,
    savedResult,

    previewTopics: computed(() => analyzeResult.value?.preview.topics ?? []),
    duplicateDetected: computed(() => analyzeResult.value?.duplicate_detected ?? false),
    existingSession: computed(() => analyzeResult.value?.comparison?.existing_session ?? null),
    savedSession: computed(() => savedResult.value?.data ?? null),
  }
}
