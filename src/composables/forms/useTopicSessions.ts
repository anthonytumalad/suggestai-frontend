import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed, ref, type Ref } from 'vue'
import { formService } from '@/services/forms'
import type { TopicSession } from '@/services/forms'

// --- types ---

export type SortOption = 'newest' | 'oldest' | 'topics_desc' | 'suggestions_desc' | 'outliers_desc'
export type TopicsRange = '1-5' | '6-15' | '15+'

interface UseTopicSessionsOptions {
  formId:          Ref<number> | number
  page?:           Ref<number>
  perPage?:        Ref<number>
  search?:         Ref<string>
  selectedStatus?: Ref<string | null>
  selectedTopics?: Ref<TopicsRange | null>
  selectedSort?:   Ref<SortOption | null>
}

// --- query keys ---

export const TOPIC_SESSIONS_QUERY_KEYS = {
  all:     ['topic-sessions'] as const,
  list:    (formId: number) => ['topic-sessions', formId] as const,
  detail:  (formId: number, sessionId: number) => ['topic-sessions', formId, sessionId] as const,
}

// --- helpers ---

const toNum = (r: Ref<number> | number) =>
  typeof r === 'number' ? r : r.value

const matchesTopicRange = (n: number, range: TopicsRange) => {
  if (range === '1-5')  return n >= 1 && n <= 5
  if (range === '6-15') return n >= 6 && n <= 15
  if (range === '15+')  return n > 15
  return true
}

// --- composable ---

export function useTopicSessions(options: UseTopicSessionsOptions) {
  const queryClient = useQueryClient()

  const formId  = computed(() => toNum(options.formId))
  const page    = options.page    ?? ref(1)
  const perPage = options.perPage ?? ref(15)

  // --- sessions list ---

  const sessionsQuery = useQuery({
    queryKey: computed(() => TOPIC_SESSIONS_QUERY_KEYS.list(formId.value)),
    queryFn:  () => formService.getTopicSessions(formId.value),
    enabled:  computed(() => !!formId.value),
  })

  const sessions = computed(() => sessionsQuery.data.value?.data ?? [])

  // --- filtered + sorted ---

  const filteredSessions = computed(() => {
    let result = [...sessions.value]

    const q = options.search?.value?.toLowerCase()
    if (q) result = result.filter(s => s.name?.toLowerCase().includes(q))

    const status = options.selectedStatus?.value
    if (status) result = result.filter(s => s.status === status)

    const topics = options.selectedTopics?.value
    if (topics) result = result.filter(s => matchesTopicRange(s.total_topics ?? 0, topics))

    const sort = options.selectedSort?.value
    if (sort) {
      const sorters: Record<SortOption, (a: TopicSession, b: TopicSession) => number> = {
        newest:           (a, b) => +new Date(b.created_at) - +new Date(a.created_at),
        oldest:           (a, b) => +new Date(a.created_at) - +new Date(b.created_at),
        topics_desc:      (a, b) => (b.total_topics    ?? 0) - (a.total_topics    ?? 0),
        suggestions_desc: (a, b) => (b.total_documents ?? 0) - (a.total_documents ?? 0),
        outliers_desc:    (a, b) => (b.outliers        ?? 0) - (a.outliers        ?? 0),
      }
      result.sort(sorters[sort])
    }

    return result
  })

  const total = computed(() => filteredSessions.value.length)

  const paginatedSessions = computed(() => {
    const start = (page.value - 1) * perPage.value
    return filteredSessions.value.slice(start, start + perPage.value)
  })

  // --- session details ---

  const useSessionDetails = (sessionId: Ref<number> | number) => {
    const id = computed(() => toNum(sessionId))
    return useQuery({
      queryKey: computed(() => TOPIC_SESSIONS_QUERY_KEYS.detail(formId.value, id.value)),
      queryFn:  () => formService.getTopicSessionDetails(formId.value, id.value),
      enabled:  computed(() => !!id.value && !!formId.value),
    })
  }

  // --- mutations ---

  const invalidateSessions = () =>
    queryClient.invalidateQueries({ queryKey: TOPIC_SESSIONS_QUERY_KEYS.list(formId.value) })

  const analyzeTopicsMutation = useMutation({
    mutationFn: (params: { start_date?: string; end_date?: string }) =>
      formService.analyzeTopics(formId.value, params),
    onSuccess: invalidateSessions,
  })

  // --- utils ---

  const hasDuplicates = (session: TopicSession) =>
    sessions.value.some(s =>
      s.id !== session.id &&
      s.date_range?.start === session.date_range?.start &&
      s.date_range?.end   === session.date_range?.end
    )

  return {
    // query state
    isLoading:  sessionsQuery.isLoading,
    isFetching: sessionsQuery.isFetching,
    isError:      sessionsQuery.isError,
    sessionError: sessionsQuery.error,

    // data
    sessions,
    paginatedSessions,
    total,

    // pagination
    page,
    perPage,

    // utils
    hasDuplicates,
    useSessionDetails,

    // mutations
    analyzeTopics: analyzeTopicsMutation.mutateAsync,
    isAnalyzing:   analyzeTopicsMutation.isPending,
    analyzeError:  analyzeTopicsMutation.error,
  }
}
