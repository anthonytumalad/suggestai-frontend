import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import api from '@/api'
import { apiEndpoints } from '@/api/endpoints'

export function useDashboard() {
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey:    ['dashboard'],
    queryFn:     () => api.get(apiEndpoints.dashboard).then(r => r.data),
    staleTime:   1000 * 60 * 2,
  })

  return {
    stats:             computed(() => data.value?.stats),
    timeline:          computed(() => data.value?.timeline ?? []),
    perForm:           computed(() => data.value?.per_form ?? []),
    anonymousRatio:    computed(() => data.value?.anonymous_ratio),
    recentSuggestions: computed(() => data.value?.recent_suggestions ?? []),
    isLoading,
    isFetching,
    refetch,
  }
}
