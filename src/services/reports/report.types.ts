export type ReportFormat = 'pdf' | 'csv' | 'xlsx'
export type ReportStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface Report {
  id: number
  form_id: number
  topic_session_id: number
  generated_by: number
  title: string
  file_path: string | null
  file_url: string | null
  format: ReportFormat
  status: ReportStatus
  file_size: number | null
  file_size_formatted: string
  generated_at: string | null
  created_at: string
  updated_at: string
  form?: { id: number; title: string }
  session?: { id: number; name: string }
  generated_by_user?: { id: number; email: string }
}

export interface ReportResponse {
  success: boolean
  data: Report[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface CreateReportPayload {
  topic_session_id: number
  format?: ReportFormat
}

export interface ReportIndexParams {
  page?: number
  per_page?: number
  status?: string
  format?: string
  search?: string
}
