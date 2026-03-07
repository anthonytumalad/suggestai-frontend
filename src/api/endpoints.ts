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
    analyzeStatus: (formId: number) => `/forms/${formId}/suggestions/analyze/status`,
    save: (formId: number) => `/forms/${formId}/suggestions/save`,

    topicSessions: (formId: number) => `/forms/${formId}/topic-sessions`,
    topicSessionDetails: (formId: number, sessionId: number) => `/forms/${formId}/topic-sessions/${sessionId}`,

    exportSuggestions: (formId: number) => `/forms/${formId}/suggestions/export`,

    visualization: {
      distribution: (formId: number, sessionId: number) =>
        `/forms/${formId}/sessions/${sessionId}/visualization/distribution`,
      keywords: (formId: number, sessionId: number) =>
        `/forms/${formId}/sessions/${sessionId}/visualization/keywords`,
      timeline: (formId: number, sessionId: number) =>
        `/forms/${formId}/sessions/${sessionId}/visualization/timeline`,
      stats: (formId: number, sessionId: number) =>
        `/forms/${formId}/sessions/${sessionId}/visualization/stats`,
    },

    deleteSuggestion: (formId: number, suggestionId: number) => `/forms/${formId}/suggestions/${suggestionId}`,
    bulkDeleteSuggestions: (formId: number) => `/forms/${formId}/suggestions`,
  },
  reports: {
    index: () => `/reports`,
    store: () => `/reports`,
    show: (reportId: number) => `/reports/${reportId}`,
    download: (reportId: number) => `/reports/${reportId}/download`,
    destroy: (reportId: number) => `/reports/${reportId}`,
    bulkDestroy: () => `/reports`,
  },
  dashboard: '/dashboard',
}
