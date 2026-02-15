import api from "@/api"
import { apiEndpoints } from "@/api/endpoints"

// ------------------------------------------------------------------ //
//  Shared types                                                        //
// ------------------------------------------------------------------ //

export interface PaginationMeta {
  current_page: number
  from: number | null
  last_page: number
  links: Array<{ url: string | null; label: string; active: boolean }>
  path: string
  per_page: number
  to: number | null
  total: number
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

// ------------------------------------------------------------------ //
//  Topic types                                                         //
// ------------------------------------------------------------------ //

/** A single topic as returned by both analyze and save endpoints */
export interface Topic {
  id: number
  topic_id: number
  label: string
  document_count: number
  representation_score: number
  keywords: string[]
}

/** Topic with full detail (used in session detail view) */
export interface TopicDetail extends Topic {
  original_name: string
  language: string
  sample_suggestions: Array<{
    id: number
    suggestion: string
    is_anonymous: boolean
    student: { email: string | null } | null
    created_at: string
  }>
}

/** Session summary (used in session list) */
export interface TopicSession {
  id: number
  name: string
  total_topics: number
  total_documents: number
  outliers: number
  status: string
  created_at: string
  topics_preview: Array<{ label: string; count: number }>
  model_parameters?: {
    form_id: number
    date_range: { start: string | null; end: string | null }
  }
}

// ------------------------------------------------------------------ //
//  Response types — each maps 1:1 to what Laravel actually returns    //
// ------------------------------------------------------------------ //

export interface FormResponse {
  data: Form[]
  meta: PaginationMeta
}

export interface SuggestionResponse {
  data: Suggestion[]
  meta: PaginationMeta
}

export interface TopicSessionsResponse {
  success: boolean
  data: TopicSession[]
}

export interface TopicSessionDetailsResponse {
  success: boolean
  data: {
    session: {
      id: number
      name: string
      total_topics: number
      total_documents: number
      outliers: number
      created_at: string
    }
    topics: TopicDetail[]
  }
}

/**
 * Response from POST /forms/{id}/suggestions/analyze
 * Laravel returns a PREVIEW — nothing is saved yet.
 * May also include duplicate_detected + comparison if a session exists.
 */
export interface AnalyzeTopicsResponse {
  success: boolean
  message: string
  preview: {
    total_topics: number
    total_documents: number
    outliers: number
    topics: Array<{
      topic_id: number
      label: string
      document_count: number
      representation_score: number
      keywords: string[]
    }>
  }
  meta: {
    form_id: number
    form_title: string
    total_analyzed: number
    date_range: { start: string | null; end: string | null }
  }
  // Present when a duplicate session exists for the same date range
  duplicate_detected?: boolean
  comparison?: {
    existing_session: {
      id: number
      name: string
      total_topics: number
      total_documents: number
      outliers: number
      created_at: string
      topics_preview: Array<{
        label: string
        document_count: number
        keywords: string[]
      }>
    }
    differences: {
      topic_count_change: number
      document_count_change: number
      outlier_change: number
      analysis_age: string
    }
  }
}

/**
 * Response from POST /forms/{id}/suggestions/topic-sessions
 * Laravel saves the session and returns the persisted data.
 */
export interface SaveTopicSessionResponse {
  success: boolean
  message: string
  data: {
    session: {
      id: number
      name: string
      total_topics: number
      total_documents: number
      outliers: number
      created_at: string
    }
    topics: Topic[]
  }
  meta: {
    form_id: number
    form_title: string
    date_range: { start: string | null; end: string | null }
    action_taken: string
  }
}

export class FormService {
  static async index(
    params: { page?: number; per_page?: number; userId?: number | null } = {}
  ): Promise<FormResponse> {
    const { page = 1, per_page = 15, userId } = params
    const { data } = await api.get<FormResponse>(apiEndpoints.forms.index, {
      params: { page, per_page, user_id: userId },
    })
    return data
  }

  static async show(formId: number): Promise<{ data: Form }> {
    const response = await api.get<{ data: Form }>(apiEndpoints.forms.show(formId))
    return response.data
  }

  static async suggestions(
    formId: number,
    params: { page?: number; per_page?: number; start_date?: string; end_date?: string } = {}
  ): Promise<SuggestionResponse> {
    const { data } = await api.get<SuggestionResponse>(
      apiEndpoints.forms.suggestions(formId),
      { params }
    )
    return data
  }

  static async getTopicSessions(formId: number): Promise<TopicSessionsResponse> {
    const { data } = await api.get<TopicSessionsResponse>(
      apiEndpoints.forms.topicSessions(formId)
    )
    return data
  }

  static async getTopicSessionDetails(
    formId: number,
    sessionId: number
  ): Promise<TopicSessionDetailsResponse> {
    const { data } = await api.get<TopicSessionDetailsResponse>(
      apiEndpoints.forms.topicSessionDetails(formId, sessionId)
    )
    return data
  }


  static async deleteTopicSession(
    formId: number,
    sessionId: number
  ): Promise<{ success: boolean; message: string }> {
    const { data } = await api.delete<{ success: boolean; message: string }>(
      apiEndpoints.forms.deleteTopicSession(formId, sessionId)
    )
    return data
  }

  static async analyzeTopics(
    formId: number,
    params: { start_date?: string; end_date?: string } = {}
  ): Promise<AnalyzeTopicsResponse> {
    const { data } = await api.post<AnalyzeTopicsResponse>(
      apiEndpoints.forms.analyze(formId),
      params
    )
    return data
  }

  static async saveTopicSession(
    formId: number,
    params: {
      start_date?: string
      end_date?: string
      session_name?: string
      action?: 'keep_both' | 'replace'
    } = {}
  ): Promise<SaveTopicSessionResponse> {
    const { data } = await api.post<SaveTopicSessionResponse>(
      apiEndpoints.forms.saveTopicSession(formId),
      params
    )
    return data
  }
}
