import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { formService } from '@/services/forms'
import type { Form } from '@/services/forms'

export const FORM_QUERY_KEYS = {
  detail: (formId: number) => ['forms', formId] as const,
}

export function useFormDetails(formId: number) {
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: FORM_QUERY_KEYS.detail(formId),
    queryFn:  () => formService.show(formId),
    enabled:  !!formId,
  })

  return {
    form:       computed<Form | undefined>(() => data.value?.data),
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  }
}
