import { ref, computed } from "vue"
import { FormService } from "@/services/formService"
import { useMutation } from "@tanstack/vue-query"

interface Error {
  response?: {
    data?: {
      error?: string
      message?: string
    }
  }
  message?: string
}

interface SummarizeParams {
  start_date?: string
  end_date?: string
}

export function useSummarize() {
  const isSummarizing = ref(false)
  const error = ref<string | null>(null)

  const mutation = useMutation({
    mutationFn: ({ formId, params }: { formId: number; params: SummarizeParams }) =>
      FormService.analyzeTopics(formId, params),
    onMutate: () => {
      isSummarizing.value = true
      error.value = null
    },
    onSuccess: (data) => {
      isSummarizing.value = false
      console.log('Analysis complete:', data)
    },
    onError: (err: Error) => {
      isSummarizing.value = false
      error.value = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to analyze topics'
    },
  })

  const summarizeTopics = async (
    formId: number,
    dateRange: { start: Date | null; end: Date | null }
  ) => {
    const params: SummarizeParams = {}

    if (dateRange.start) {
      params.start_date = dateRange.start.toISOString().split('T')[0]
    }
    if (dateRange.end) {
      params.end_date = dateRange.end.toISOString().split('T')[0]
    }

    return mutation.mutateAsync({ formId, params })
  }

  const data = computed(() => {
    return mutation.data.value?.data ?? null
  })

  return {
    summarizeTopics,
    isSummarizing,
    error,
    data,
    isSuccess: mutation.isSuccess
  }
}
