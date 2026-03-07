import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '@/services/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/signin',
      name: 'SignIn',
      component: () => import('@/views/auth/SignInView.vue'),
      meta: { title: 'Sign in', guest: true }
    },
    {
      path: '/',
      component: () => import('@/layouts/BaseLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/dashboard/DashboardView.vue'),
          meta: { title: 'Dashboard' }
        },
        {
          path: 'forms',
          name: 'forms',
          component: () => import('@/views/forms/FormsView.vue'),
          meta: { title: 'Forms' }
        },
        {
          path: 'forms/add',
          name: 'addForm',
          component: () => import('@/views/forms/FormsAddView.vue'),
          meta: { title: 'Add Form' }
        },
        {
          path: 'forms/:id',
          component: () => import('@/layouts/FormLayout.vue'),
          children: [
            {
              path: '',
              redirect: to => ({
                name: 'formOverview',
                params: { id: to.params.id },
                query: to.query,
              }),
            },
            {
              path: 'suggestions',
              name: 'formSuggestions',
              component: () => import('@/views/forms/FormSuggestionView.vue'),
              meta: { title: 'Suggestions' }
            },
            {
              path: 'summary',
              name: 'formSummary',
              component: () => import('@/views/forms/FormsSummaryView.vue'),
              meta: { title: 'Summary' }
            },
            {
              path: 'overview',
              name: 'formOverview',
              component: () => import('@/views/forms/FormsOverview.vue'),
              meta: { title: 'Overview' }
            }
          ]
        },
        {
          path: 'reports',
          name: 'reports',
          component: () => import('@/views/reports/ReportsView.vue'),
          meta: { title: 'Reports' }
        },
        {
          path: 'trash',
          name: 'trash',
          component: () => import('@/views/trash/TrashView.vue')
        }
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/errors/NotFoundView.vue'),
      meta: { title: 'Page Not Found' }
    },
    {
      path: '/forbidden',
      name: 'AccessForbidden',
      component: () => import('@/views/errors/ForbiddenView.vue'),
      meta: { title: 'Access Forbidden' }
    }
  ],
})

router.beforeEach((to, _from, next) => {
  const isAuthenticated = authService.isAuthenticated()
  const requiresAuth = to.matched.some(r => r.meta.requiresAuth)
  const isGuestOnly = to.matched.some(r => r.meta.guest)

  document.title = to.meta.title
    ? `${to.meta.title} | TLC-SUGGEST`
    : 'TLC-SUGGEST'

  if (requiresAuth && !isAuthenticated) {
    next({ name: 'SignIn', query: { redirect: to.fullPath } })
  } else if (isGuestOnly && isAuthenticated) {
    next((to.query.redirect as string) || '/')
  } else {
    next()
  }
})

export default router
