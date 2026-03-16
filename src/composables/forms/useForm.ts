import { ref, computed, watch } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { formService } from '@/services/forms'
import type { Form, PaginationMeta } from '@/services/forms'

export type FormSortOption = 'newest' | 'oldest' | 'most_suggestions'
export type FormStatusFilter = 'all' | 'active' | 'inactive'

export type FormItem = Omit<Pick<Form, 'id' | 'title' | 'is_active' | 'suggestions_count'>, 'suggestions_count'> & { suggestions_count: number }

interface UseFormsParams {
  page?: number
  perPage?: number
  userId?: number | null
}

export const FORMS_QUERY_KEYS = {
  all: ['forms'] as const,
  list: (filters: object) => ['forms', filters] as const,
}

export function useForms(params: UseFormsParams = {}) {
  const page = ref(params.page ?? 1)
  const perPage = ref(params.perPage ?? 15)
  const userId = ref(params.userId ?? null)
  const search = ref('')
  const statusFilter = ref<FormStatusFilter>('all')
  const sortOption = ref<FormSortOption>('newest')

  watch([search, statusFilter, sortOption], () => { page.value = 1 })

  const queryKey = computed(() =>
    FORMS_QUERY_KEYS.list({
      page: page.value,
      perPage: perPage.value,
      userId: userId.value,
      search: search.value,
      status: statusFilter.value,
      sort: sortOption.value,
    })
  )

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey,
    queryFn: () => formService.index({
      page: page.value,
      per_page: perPage.value,
      userId: userId.value,
      search: search.value || undefined,
      is_active: statusFilter.value === 'all'
        ? undefined
        : statusFilter.value === 'active',
      sort: sortOption.value,
    }),
  })

  const forms = computed<FormItem[]>(() =>
    (data.value?.data ?? []).map(({ id, title, suggestions_count, is_active }) => ({
      id,
      title,
      is_active,
      suggestions_count: suggestions_count ?? 0,
    }))
  )

  const meta = computed<PaginationMeta | undefined>(() => data.value?.meta)
  const total = computed(() => meta.value?.total ?? 0)

  const hasActiveFilters = computed(() =>
    search.value !== '' || statusFilter.value !== 'all' || sortOption.value !== 'newest'
  )

  const clearFilters = () => {
    search.value = ''
    statusFilter.value = 'all'
    sortOption.value = 'newest'
    page.value = 1
  }


  const queryClient = useQueryClient()

  const {
    mutate: createForm,
    mutateAsync: createFormAsync,
    isPending: isCreating,
    isError: isCreateError,
    error: createError,
    reset: resetCreate,
  } = useMutation({
    mutationFn: (payload: FormData) => formService.store(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FORMS_QUERY_KEYS.all })
    },
  })

  const {
    mutate: updateForm,
    mutateAsync: updateFormAsync,
    isPending: isUpdating,
    isError: isUpdateError,
    error: updateError,
    reset: resetUpdate,
  } = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: FormData }) =>
      formService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] })
    },
  })

  const {
    mutate: deleteForm,
    mutateAsync: deleteFormAsync,
    isPending: isDeleting,
  } = useMutation({
    mutationFn: (formId: number) => formService.destroy(formId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FORMS_QUERY_KEYS.all })
    },
  })

  return {
    forms,
    meta,
    total,

    search,
    statusFilter,
    sortOption,
    hasActiveFilters,
    clearFilters,

    isLoading,
    isFetching,
    isError,
    error,
    refetch,

    page,
    perPage,
    userId,

    setPage: (val: number) => { page.value = val },
    setPerPage: (val: number) => { perPage.value = val },

    createForm,
    createFormAsync,
    isCreating,
    isCreateError,
    createError,
    resetCreate,

    updateForm,
    updateFormAsync,
    isUpdating,
    isUpdateError,
    updateError,
    resetUpdate,

    deleteForm,
    deleteFormAsync,
    isDeleting,
  }
}
