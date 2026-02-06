import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { FormService, type Form } from '@/services/formService'

export function useFormDetails(formId: number) {
  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ['form', formId],
    queryFn: () => FormService.show(formId),
    enabled: !!formId,
  })

  const form = computed<Form | undefined>(() => data.value?.data)

  return {
    form,
    data,

    isLoading,
    isError,
    isFetching,
    error,

    refetch,
  }
}
