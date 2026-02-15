export const apiEndpoints = {
  auth: {
    authenticate: '/auth/authenticate',
    user: '/auth/me',
    destroy: '/auth/signout',
    destroyAll: '/auth/signoutAll',
  },
  forms: {
    index: '/forms',
    store: '/forms',
    show: (formId: number) => `/forms/${formId}`,
    suggestions: (formId: number) => `/forms/${formId}/suggestions`,
    analyze: (formId: number) => `/forms/${formId}/suggestions/analyze`,
    topicSessions: (formId: number) => `/forms/${formId}/suggestions/topic-sessions`,
    topicSessionDetails: (formId: number, sessionId: number) => `/forms/${formId}/suggestions/topic-sessions/${sessionId}`,
    deleteTopicSession: (formId: number, sessionId: number) => `/forms/${formId}/suggestions/topic-sessions/${sessionId}`,
    topicSuggestions: (formId: number, topicId: number) => `/forms/${formId}/suggestions/topics/${topicId}/suggestions`,
  }
}
