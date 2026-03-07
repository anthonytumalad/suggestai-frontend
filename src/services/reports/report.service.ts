import api from '@/api'
import { apiEndpoints } from '@/api/endpoints'
import { downloadReportBlob } from './report.helpers'
import type { CreateReportPayload, Report, ReportFormat, ReportIndexParams, ReportResponse } from './report.types'

export const reportService = {
  async index(params: ReportIndexParams = {}): Promise<ReportResponse> {
    const { data } = await api.get<ReportResponse>(apiEndpoints.reports.index(), { params })
    return data
  },

  async store(payload: CreateReportPayload): Promise<{ data: Report }> {
    const { data } = await api.post<{ data: Report }>(apiEndpoints.reports.store(), payload)
    return data
  },

  async show(reportId: number): Promise<{ data: Report }> {
    const { data } = await api.get<{ data: Report }>(apiEndpoints.reports.show(reportId))
    return data
  },

  async download(reportId: number, title: string, format: ReportFormat): Promise<void> {
    const response = await api.get(apiEndpoints.reports.download(reportId), {
      responseType: 'blob',
      withCredentials: true,
    })
    await downloadReportBlob(response.data, title, format)
  },

  async destroy(reportId: number): Promise<void> {
    await api.delete(apiEndpoints.reports.destroy(reportId))
  },

  async bulkDestroy(ids: number[]): Promise<void> {
    await api.delete(apiEndpoints.reports.bulkDestroy(), { data: { ids } })
  },
}
