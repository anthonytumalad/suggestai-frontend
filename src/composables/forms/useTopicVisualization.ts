import { useQuery } from '@tanstack/vue-query'
import { computed, type Ref } from 'vue'
import { formService } from '@/services/forms'

// --- types ---

interface UseTopicVisualizationOptions {
  formId:    number | Ref<number>
  sessionId: number | Ref<number | null>
}

// --- query keys ---

export const VISUALIZATION_QUERY_KEYS = {
  stats:        (formId: number, sessionId: number) => ['viz', formId, sessionId, 'stats']        as const,
  distribution: (formId: number, sessionId: number) => ['viz', formId, sessionId, 'distribution'] as const,
  keywords:     (formId: number, sessionId: number) => ['viz', formId, sessionId, 'keywords']     as const,
  timeline:     (formId: number, sessionId: number) => ['viz', formId, sessionId, 'timeline']     as const,
}

// --- helpers ---

const toNum = (r: number | Ref<number | null>): number | null =>
  typeof r === 'number' ? r : r.value

// --- composable ---

export function useTopicVisualization(options: UseTopicVisualizationOptions) {
  const formId    = computed(() => toNum(options.formId as number | Ref<number>))
  const sessionId = computed(() => toNum(options.sessionId))
  const enabled   = computed(() => !!formId.value && !!sessionId.value)

  const statsQuery = useQuery({
    queryKey: computed(() => VISUALIZATION_QUERY_KEYS.stats(formId.value!, sessionId.value!)),
    queryFn:  () => formService.getStats(formId.value!, sessionId.value!),
    enabled,
  })

  const distributionQuery = useQuery({
    queryKey: computed(() => VISUALIZATION_QUERY_KEYS.distribution(formId.value!, sessionId.value!)),
    queryFn:  () => formService.getDistribution(formId.value!, sessionId.value!),
    enabled,
  })

  const keywordsQuery = useQuery({
    queryKey: computed(() => VISUALIZATION_QUERY_KEYS.keywords(formId.value!, sessionId.value!)),
    queryFn:  () => formService.getKeywords(formId.value!, sessionId.value!),
    enabled,
  })

  const timelineQuery = useQuery({
    queryKey: computed(() => VISUALIZATION_QUERY_KEYS.timeline(formId.value!, sessionId.value!)),
    queryFn:  () => formService.getTimeline(formId.value!, sessionId.value!),
    enabled,
  })

  return {
    // data
    stats:        computed(() => statsQuery.data.value),
    distribution: computed(() => distributionQuery.data.value),
    keywords:     computed(() => keywordsQuery.data.value?.topics ?? []),
    timeline:     computed(() => timelineQuery.data.value?.topics ?? []),

    // individual loading states
    isLoadingStats:        statsQuery.isLoading,
    isLoadingDistribution: distributionQuery.isLoading,
    isLoadingKeywords:     keywordsQuery.isLoading,
    isLoadingTimeline:     timelineQuery.isLoading,

    // combined
    isLoading: computed(() =>
      statsQuery.isLoading.value        ||
      distributionQuery.isLoading.value ||
      keywordsQuery.isLoading.value     ||
      timelineQuery.isLoading.value
    ),
  }
}
