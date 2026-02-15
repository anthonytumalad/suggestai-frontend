import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed, ref, type Ref } from 'vue'
import {
  FormService,
  type TopicSession,
  type TopicSessionsResponse,
  type TopicSessionDetailsResponse
} from '@/services/formService'

interface UseTopicSessionsOptions {
  formId: Ref<number> | number
  page?: Ref<number>
  perPage?: Ref<number>
}

export function useTopicSessions(options: UseTopicSessionsOptions) {
  const queryClient = useQueryClient()

  const formId = computed(() =>
    typeof options.formId === 'number' ? options.formId : options.formId.value
  )

  const page = options.page || ref(1)
  const perPage = options.perPage || ref(15)

  const sessionsQuery = useQuery({
    queryKey: ['topic-sessions', formId],
    queryFn: () => FormService.getTopicSessions(formId.value),
    enabled: computed(() => !!formId.value),
  })

  const paginatedSessions = computed(() => {
    const sessions = sessionsQuery.data.value?.data || []
    const start = (page.value - 1) * perPage.value
    const end = start + perPage.value
    return sessions.slice(start, end)
  })

  const total = computed(() => sessionsQuery.data.value?.data?.length || 0)

  const hasDuplicates = (session: TopicSession) => {
    const sessions = sessionsQuery.data.value?.data || []
    const dateRange = session.model_parameters?.date_range

    if (!dateRange) return false

    return sessions.filter(s => {
      const range = s.model_parameters?.date_range
      return range?.start === dateRange.start &&
        range?.end === dateRange.end &&
        s.id !== session.id
    }).length > 0
  }

  const useSessionDetails = (sessionId: Ref<number> | number) => {
    const id = computed(() =>
      typeof sessionId === 'number' ? sessionId : sessionId.value
    )

    return useQuery({
      queryKey: ['topic-session-details', formId, id],
      queryFn: () => FormService.getTopicSessionDetails(formId.value, id.value),
      enabled: computed(() => !!id.value && !!formId.value),
    })
  }

  const deleteSessionMutation = useMutation({
    mutationFn: (sessionId: number) =>
      FormService.deleteTopicSession(formId.value, sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['topic-sessions', formId]
      })
    },
  })

  const analyzeTopicsMutation = useMutation({
    mutationFn: (params: {
      start_date?: string
      end_date?: string
      force_create?: boolean
    }) => FormService.analyzeTopics(formId.value, params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['topic-sessions', formId]
      })
    },
  })


  return {
    // Queries
    sessionsQuery,
    sessions: computed(() => sessionsQuery.data.value?.data || []),
    paginatedSessions,

    // Pagination
    page,
    perPage,
    total,

    // Utilities
    hasDuplicates,
    useSessionDetails,

    // Mutations
    deleteSession: deleteSessionMutation.mutateAsync,
    isDeletingSession: computed(() => deleteSessionMutation.isPending.value),

    analyzeTopics: analyzeTopicsMutation.mutateAsync,
    isAnalyzing: computed(() => analyzeTopicsMutation.isPending.value),
    analyzeError: computed(() => analyzeTopicsMutation.error.value),
  }
}


