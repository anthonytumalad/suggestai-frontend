import { ref, computed } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { formService } from '@/services/forms'
import type { Suggestion, PaginationMeta } from '@/services/forms'

type AnonymousFilter = 'all' | 'anonymous' | 'identified'

export const SUGGESTIONS_QUERY_KEYS = {
  all: ['suggestions'] as const,
  list: (formId: number, filters: object) => ['suggestions', formId, filters] as const,
}

interface UseSuggestionsParams {
  formId: number
  page?: number
  perPage?: number
  start_date?: string
  end_date?: string
}

export function useSuggestions(params: UseSuggestionsParams) {
  const queryClient = useQueryClient()

  const formId          = ref(params.formId)
  const page            = ref(params.page    ?? 1)
  const perPage         = ref(params.perPage ?? 15)
  const startDate       = ref(params.start_date)
  const endDate         = ref(params.end_date)
  const search          = ref('')
  const anonymousFilter = ref<AnonymousFilter>('all')

  const queryKey = computed(() =>
    SUGGESTIONS_QUERY_KEYS.list(formId.value, {
      page: page.value,
      perPage: perPage.value,
      startDate: startDate.value,
      endDate: endDate.value,
      search: search.value,
      anonymousFilter: anonymousFilter.value,
    })
  )

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey,
    queryFn: () => formService.suggestions(formId.value, {
      page:         page.value,
      per_page:     perPage.value,
      start_date:   startDate.value,
      end_date:     endDate.value,
      search:       search.value || undefined,
      is_anonymous: anonymousFilter.value === 'all'
        ? undefined
        : anonymousFilter.value === 'anonymous',
    }),
  })

  // --- mutations ---

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: SUGGESTIONS_QUERY_KEYS.all })

  const deleteMutation = useMutation({
    mutationFn: (suggestionId: number) =>
      formService.deleteSuggestion(formId.value, suggestionId),
    onSuccess: invalidate,
  })

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: number[]) =>
      formService.bulkDeleteSuggestions(formId.value, ids),
    onSuccess: invalidate,
  })

  // --- setters (reset page on filter change) ---

  const resetPage = () => { page.value = 1 }

  const setPage    = (val: number) => { page.value = val }
  const setPerPage = (val: number) => { perPage.value = val; resetPage() }

  const setSearch = useDebounceFn((val: string) => {
    search.value = val
    resetPage()
  }, 300)

  const setAnonymousFilter = (val: AnonymousFilter) => {
    anonymousFilter.value = val
    resetPage()
  }

  const setStartDate = (val: string | undefined) => { startDate.value = val; resetPage() }
  const setEndDate   = (val: string | undefined) => { endDate.value   = val; resetPage() }

  const setDateRange = (range: { start: Date | null; end: Date | null }) => {
    startDate.value = range.start?.toISOString().split('T')[0]
    endDate.value   = range.end?.toISOString().split('T')[0]
    resetPage()
  }

  // --- computed ---

  const suggestions = computed<Suggestion[]>(() => data.value?.data ?? [])
  const meta        = computed<PaginationMeta | undefined>(() => data.value?.meta)
  const total       = computed(() => meta.value?.total ?? 0)

  return {
    suggestions,
    meta,
    total,

    search,
    anonymousFilter,
    startDate,
    endDate,

    isLoading,
    isFetching,
    isError,
    error,
    refetch,

    page,
    perPage,

    setPage,
    setPerPage,
    setSearch,
    setAnonymousFilter,
    setStartDate,
    setEndDate,
    setDateRange,

    deleteSuggestion:      deleteMutation.mutateAsync,
    isDeleting:            deleteMutation.isPending,
    bulkDeleteSuggestions: bulkDeleteMutation.mutateAsync,
    isBulkDeleting:        bulkDeleteMutation.isPending,
  }
}
