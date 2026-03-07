import { computed, unref, type Ref } from 'vue'
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/vue-query'
import { reportService } from '@/services/reports'
import type { Report, CreateReportPayload, ReportFormat, ReportResponse } from '@/services/reports'

// --- types ---

export interface UseReportsParams {
  page?:     Ref<number> | number
  per_page?: Ref<number> | number
  status?:   Ref<string | undefined> | string | undefined
  format?:   Ref<string | undefined> | string | undefined
  search?:   Ref<string | undefined> | string | undefined
}

// --- query keys ---

export const REPORT_QUERY_KEYS = {
  all:    ()                              => ['reports']               as const,
  lists:  ()                              => ['reports', 'list']       as const,
  list:   (filters: Record<string, unknown>) => ['reports', 'list', filters] as const,
  detail: (id: number)                    => ['reports', id]           as const,
}

// --- useReports (list) ---

export function useReports(params: UseReportsParams = {}) {
  const queryClient = useQueryClient()

  const filters = computed(() => ({
    page:     unref(params.page)     ?? 1,
    per_page: unref(params.per_page) ?? 15,
    status:   unref(params.status),
    format:   unref(params.format),
    search:   unref(params.search),
  }))

  const reportsQuery = useQuery<ReportResponse>({
    queryKey:        computed(() => REPORT_QUERY_KEYS.list(filters.value)),
    queryFn:         () => reportService.index(filters.value),
    placeholderData: keepPreviousData,
  })

  const invalidateLists = () =>
    queryClient.invalidateQueries({ queryKey: REPORT_QUERY_KEYS.lists() })

  const createMutation = useMutation({
    mutationFn: (payload: CreateReportPayload) => reportService.store(payload),
    onSuccess:  invalidateLists,
  })

  const deleteMutation = useMutation({
    mutationFn: (reportId: number) => reportService.destroy(reportId),
    onSuccess: (_data, reportId) => {
      queryClient.removeQueries({ queryKey: REPORT_QUERY_KEYS.detail(reportId) })
      invalidateLists()
    },
  })

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: number[]) => reportService.bulkDestroy(ids),
    onSuccess: (_data, ids) => {
      ids.forEach(id => queryClient.removeQueries({ queryKey: REPORT_QUERY_KEYS.detail(id) }))
      invalidateLists()
    },
  })

  const downloadMutation = useMutation({
    mutationFn: ({ reportId, title, format }: { reportId: number; title: string; format: ReportFormat }) =>
      reportService.download(reportId, title, format),
  })

  const reports    = computed(() => reportsQuery.data.value?.data ?? [])
  const meta       = computed(() => reportsQuery.data.value?.meta)
  const total      = computed(() => meta.value?.total ?? 0)
  const totalPages = computed(() => meta.value?.last_page ?? 1)
  const isEmpty    = computed(() => !reportsQuery.isLoading.value && reports.value.length === 0)

  return {
    // query state
    isLoading:  reportsQuery.isLoading,
    isFetching: reportsQuery.isFetching,
    isError:    reportsQuery.isError,
    error:      reportsQuery.error,
    refetch:    reportsQuery.refetch,

    // data
    reports,
    meta,
    total,
    totalPages,
    isEmpty,

    // mutations
    createReport:      createMutation.mutateAsync,
    isCreating:        createMutation.isPending,

    deleteReport:      deleteMutation.mutateAsync,
    isDeleting:        deleteMutation.isPending,

    bulkDeleteReports: bulkDeleteMutation.mutateAsync,
    isBulkDeleting:    bulkDeleteMutation.isPending,

    downloadReport:    downloadMutation.mutateAsync,
    isDownloading:     downloadMutation.isPending,
  }
}

// --- useReport (single) ---

export function useReport(reportId: Ref<number> | number) {
  const queryClient = useQueryClient()

  const reportQuery = useQuery<{ data: Report }>({
    queryKey: computed(() => REPORT_QUERY_KEYS.detail(unref(reportId))),
    queryFn:  () => reportService.show(unref(reportId)),
  })

  const prefetch = () =>
    queryClient.prefetchQuery({
      queryKey: REPORT_QUERY_KEYS.detail(unref(reportId)),
      queryFn:  () => reportService.show(unref(reportId)),
    })

  return {
    report:     computed(() => reportQuery.data.value?.data),
    isLoading:  reportQuery.isLoading,
    isFetching: reportQuery.isFetching,
    isError:    reportQuery.isError,
    error:      reportQuery.error,
    prefetch,
  }
}
