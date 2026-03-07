import type { Form, PaginationMeta, Suggestion, Topic, TopicDetail, TopicSession } from './form.types'

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
    session: Omit<TopicSession, 'status' | 'date_range' | 'topics'>
    topics: TopicDetail[]
  }
}

export interface AnalyzeTopicsResponse {
  success: boolean
  message: string
  warning?: string
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

export interface SaveTopicSessionResponse {
  success: boolean
  message: string
  data: {
    session: Omit<TopicSession, 'status' | 'date_range' | 'topics'>
    topics: Topic[]
  }
  meta: {
    form_id: number
    form_title: string
    date_range: { start: string | null; end: string | null }
    action_taken: string
  }
}

export interface DistributionResponse {
  labels: string[]
  data: Array<{ label: string; count: number; score: number }>
  meta: {
    total_documents: number
    total_topics: number
    outliers: number
    outlier_percent: number
  }
}

export interface KeywordsResponse {
  topics: Array<{
    label: string
    topic_id: number
    words: Array<{ text: string; value: number; rank: number }>
  }>
}

export interface TimelineResponse {
  topics: Array<{
    label: string
    data: Array<{ date: string; count: number }>
  }>
}

export interface StatsResponse {
  total_topics: number
  total_documents: number
  outliers: number
  outlier_percent: number
  avg_topic_size: number
  largest_topic: string | null
  top_keywords: string[]
}

export interface AnalyzeStatusResponse {
  status:  'pending' | 'ready'
  success: boolean
  message: string
  preview?: AnalyzeTopicsResponse['preview']
  meta?:    AnalyzeTopicsResponse['meta']
  duplicate_detected?: boolean
  comparison?:         AnalyzeTopicsResponse['comparison']
}
