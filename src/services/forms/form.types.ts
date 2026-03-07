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

export interface CreateFormParams {
  name: string
  description?: string
  is_active?: boolean
  img?: File | null
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

export interface Topic {
  id: number
  topic_id: number
  label: string
  document_count: number
  representation_score: number
  keywords: string[]
}

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

export interface TopicSession {
  id: number
  name: string
  total_topics: number
  total_documents: number
  outliers: number
  status: string
  created_at: string
  date_range: { start: string | null; end: string | null }
  topics: Topic[]
}

export type FormSortOption = 'newest' | 'oldest' | 'most_suggestions'

export interface FormIndexParams {
  page?:      number
  per_page?:  number
  userId?:    number | null
  search?:    string
  is_active?: boolean
  sort?:      FormSortOption
}
