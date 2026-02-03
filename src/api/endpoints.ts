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
    suggestions: (formId: number) => `/forms/${formId}/suggestions`,
    analyze: (formId: number) => `/forms/${formId}/suggestions/analyze`,
  }
}
