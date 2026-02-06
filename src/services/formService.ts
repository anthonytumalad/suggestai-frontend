import api from "@/api"
import { apiEndpoints } from "@/api/endpoints"

export interface FormResponse {
  data: Form[]
  meta: PaginationMeta
}

export interface SuggestionResponse {
  data: Suggestion[]
  meta: PaginationMeta
}

export interface TopicResponse {
  message: string
  data: {
    topics: number[]
    summary: Array<{
      topic: number
      count: number
      name: string
      keywords: string[]
      label: string
    }>
    keywords: Record<number, string[]>
    representative_docs: Record<number, string[]>
    document_info: Array<{
      document: string
      topic: number
      probability: number | null
    }>
    total_topics: number
  }
}

export interface Form {
  id: number
  title: string
  slug: string
  description?: string | null
  img_path?: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  suggestions_count?: number
  url: string
  qr_code_url: string
}

export interface Suggestion {
  id: number
  form_id: number
  student_id: number
  profile_picture: string | null
  student_email?: string | null
  suggestion: string
  is_anonymous: boolean
  created_at: Date
  updated_at: Date
}

export interface PaginationMeta {
  current_page: number
  from: number | null
  last_page: number
  links: Array<{
    url: string | null
    label: string
    active: boolean
  }>
  path: string
  per_page: number
  to: number | null
  total: number
}

interface IndexParams {
  page?: number
  per_page?: number
  userId?: number | null
}

export class FormService {
  static async index(params: IndexParams = {}): Promise<FormResponse> {
    const { page = 1, per_page = 15, userId } = params

    const { data } = await api.get<FormResponse>(apiEndpoints.forms.index, {
      params: { page, per_page, user_id: userId }
    })

    return data
  }

  static async show(formId: number): Promise<{ data: Form }> {
    const response = await api.get<{ data: Form }>(
      apiEndpoints.forms.show(formId)
    )
    return response.data
  }

  static async suggestions(
    formId: number,
    params: {
      page?: number
      per_page?: number
      start_date?: string
      end_date?: string
    } = {}
  ): Promise<SuggestionResponse> {
    const { data } = await api.get<SuggestionResponse>(
      apiEndpoints.forms.suggestions(formId),
      {
        params: {
          page: params.page,
          per_page: params.per_page,
          start_date: params.start_date,
          end_date: params.end_date,
        }
      }
    )

    return data
  }

  static async analyzeTopics(
    formId: number,
    params: {
      start_date?: string
      end_date?: string
    } = {}
  ): Promise<TopicResponse> {
    const { data } = await api.post<TopicResponse>(
      apiEndpoints.forms.analyze(formId),
      null,
      {
        params: {
          start_date: params.start_date,
          end_date: params.end_date,
        }
      }
    )

    return data
  }
}
