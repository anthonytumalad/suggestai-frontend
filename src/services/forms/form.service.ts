import api from '@/api'
import { apiEndpoints } from '@/api/endpoints'
import { downloadBlob } from './form.helpers'
import type {
  AnalyzeTopicsResponse,
  DistributionResponse,
  FormResponse,
  KeywordsResponse,
  SaveTopicSessionResponse,
  StatsResponse,
  SuggestionResponse,
  TimelineResponse,
  TopicSessionDetailsResponse,
  TopicSessionsResponse,
  AnalyzeStatusResponse
} from './form.response.types'
import type { Form, FormIndexParams } from './form.types'

export const formService = {
  async index(params: FormIndexParams = {}): Promise<FormResponse> {
    const { page = 1, per_page = 15, userId, search, is_active, sort } = params
    const { data } = await api.get<FormResponse>(apiEndpoints.forms.index, {
      params: {
        page,
        per_page,
        user_id: userId,
        search: search || undefined,
        is_active: is_active !== undefined ? is_active : undefined,
        sort: sort || undefined,
      },
    })
    return data
  },

  async show(formId: number): Promise<{ data: Form }> {
    const { data } = await api.get<{ data: Form }>(apiEndpoints.forms.show(formId))
    return data
  },

  async store(payload: FormData): Promise<{ message: string; data: Form }> {
    const { data } = await api.post<{ message: string; data: Form }>(
      apiEndpoints.forms.store,
      payload,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    return data
  },

  async suggestions(
    formId: number,
    params: { page?: number; per_page?: number; start_date?: string; end_date?: string; search?: string; is_anonymous?: boolean } = {}
  ): Promise<SuggestionResponse> {
    const { data } = await api.get<SuggestionResponse>(apiEndpoints.forms.suggestions(formId), { params })
    return data
  },

  async deleteSuggestion(formId: number, suggestionId: number): Promise<void> {
    await api.delete(apiEndpoints.forms.deleteSuggestion(formId, suggestionId))
  },

  async bulkDeleteSuggestions(formId: number, ids: number[]): Promise<void> {
    await api.delete(apiEndpoints.forms.bulkDeleteSuggestions(formId), { data: { ids } })
  },

  // --- topics ---

  async getTopicSessions(formId: number): Promise<TopicSessionsResponse> {
    const { data } = await api.get<TopicSessionsResponse>(apiEndpoints.forms.topicSessions(formId))
    return data
  },

  async getTopicSessionDetails(formId: number, sessionId: number): Promise<TopicSessionDetailsResponse> {
    const { data } = await api.get<TopicSessionDetailsResponse>(apiEndpoints.forms.topicSessionDetails(formId, sessionId))
    return data
  },

  async analyzeTopics(formId: number, params: { start_date?: string; end_date?: string } = {}): Promise<AnalyzeTopicsResponse> {
    const { data } = await api.post<AnalyzeTopicsResponse>(apiEndpoints.forms.analyze(formId), params)
    return data
  },

  async getAnalysisStatus(
    formId: number,
    params: { start_date?: string; end_date?: string } = {}
  ): Promise<AnalyzeStatusResponse> {
    const { data } = await api.get<AnalyzeStatusResponse>(
      apiEndpoints.forms.analyzeStatus(formId),
      { params }
    )
    return data
  },

  async saveTopicSession(
    formId: number,
    params: { start_date?: string; end_date?: string; session_name?: string; action?: 'keep_both' | 'replace' } = {}
  ): Promise<SaveTopicSessionResponse> {
    const { data } = await api.post<SaveTopicSessionResponse>(apiEndpoints.forms.save(formId), params)
    return data
  },

  // --- visualizations ---

  async getDistribution(formId: number, sessionId: number): Promise<DistributionResponse> {
    const { data } = await api.get<DistributionResponse>(apiEndpoints.forms.visualization.distribution(formId, sessionId))
    return data
  },

  async getKeywords(formId: number, sessionId: number): Promise<KeywordsResponse> {
    const { data } = await api.get<KeywordsResponse>(apiEndpoints.forms.visualization.keywords(formId, sessionId))
    return data
  },

  async getTimeline(formId: number, sessionId: number): Promise<TimelineResponse> {
    const { data } = await api.get<TimelineResponse>(apiEndpoints.forms.visualization.timeline(formId, sessionId))
    return data
  },

  async getStats(formId: number, sessionId: number): Promise<StatsResponse> {
    const { data } = await api.get<StatsResponse>(apiEndpoints.forms.visualization.stats(formId, sessionId))
    return data
  },

  // --- export ---

  async exportSuggestions(
    formId: number,
    params: { type: 'csv' | 'xlsx' | 'pdf'; start_date?: string; end_date?: string }
  ): Promise<void> {
    const response = await api.get(apiEndpoints.forms.exportSuggestions(formId), {
      params,
      responseType: 'blob',
      withCredentials: true,
    })
    downloadBlob(response.data, params.type)
  },

}
