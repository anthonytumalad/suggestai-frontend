import { ref, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import {
  FormService,
  type FormResponse,
  type Form,
  type PaginationMeta
} from '@/services/formService'
import type { FormItems } from '@/components/base/table/forms/FormsTable.vue'

interface UseFormsParams {
  page?: number
  per_page?: number
  userId?: number | null
}

export function useForms(params: UseFormsParams = {}) {
  const page = ref(params.page ?? 1)
  const perPage = ref(params.per_page ?? 15)
  const userId = ref(params.userId ?? null)

  const { data, isLoading, isFetching, isError, error, refetch  } = useQuery({
    queryKey: ['forms', { page, perPage, userId }],
    queryFn: () => FormService.index({
      page: page.value,
      per_page: perPage.value,
      userId: userId.value
    })
  })

  const forms = computed<FormItems[]>(() =>
    (data.value?.data ?? []).map(form => ({
      id: form.id,
      title: form.title,
      suggestions_count: form.suggestions_count ?? 0,
      is_active: form.is_active
    }))
  )

  const meta = computed<PaginationMeta | undefined>(() => data.value?.meta)

  const total = computed(() => meta.value?.total ?? 0)

  const setPage = (newPage: number) => {
    page.value = newPage
  }

  const setPerPage = (newPerPage: number) => {
    perPage.value = newPerPage
  }

  const setUserId = (newUserId: number | null) => {
    userId.value = newUserId
  }

  return {
    forms,
    meta,
    data,
    total,

    isLoading,
    isError,
    isFetching,
    error,

    page,
    perPage,
    userId,

    setPage,
    setPerPage,
    setUserId,
    refetch
  }
}
