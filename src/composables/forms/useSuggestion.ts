import { ref, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import {
  FormService,
  type SuggestionResponse,
  type Suggestion,
  type PaginationMeta
} from '@/services/formService'

interface UseSuggestionsParams {
  formId: number
  page?: number
  per_page?: number
  start_date?: string
  end_date?: string
}

export function useSuggestions(params: UseSuggestionsParams) {
  const formId = ref(params.formId)
  const page = ref(params.page ?? 1)
  const perPage = ref(params.per_page ?? 15)
  const startDate = ref(params.start_date)
  const endDate = ref(params.end_date)

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ['suggestions', { formId, page, perPage, startDate, endDate }],
    queryFn: () =>
      FormService.suggestions(formId.value, {
        page: page.value,
        per_page: perPage.value,
        start_date: startDate.value,
        end_date: endDate.value
      })
  })

  const suggestions = computed<Suggestion[]>(() => data.value?.data ?? [])

  const meta = computed<PaginationMeta | undefined>(() => data.value?.meta)

  const total = computed(() => meta.value?.total ?? 0)

  const setPage = (newPage: number) => {
    page.value = newPage
  }

  const setPerPage = (newPerPage: number) => {
    perPage.value = newPerPage
    page.value = 1
  }

  const setStartDate = (newStartDate: string | undefined) => {
    startDate.value = newStartDate
    page.value = 1
  }

  const setEndDate = (newEndDate: string | undefined) => {
    endDate.value = newEndDate
    page.value = 1
  }

  const setDateRange = (dateRange: { start: Date | null; end: Date | null }) => {
    startDate.value = dateRange.start
      ? dateRange.start.toISOString().split('T')[0]
      : undefined
    endDate.value = dateRange.end
      ? dateRange.end.toISOString().split('T')[0]
      : undefined
    page.value = 1
  }

  return {
    suggestions,
    meta,
    data,
    total,

    isLoading,
    isError,
    isFetching,
    error,

    page,
    perPage,
    startDate,
    endDate,

    setPage,
    setPerPage,
    setStartDate,
    setEndDate,
    setDateRange,
    refetch
  }
}
