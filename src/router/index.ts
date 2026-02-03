import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '@/services/authService'
import FormLayout from '@/layouts/FormLayout.vue'

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
          path: 'forms/:id',
          component: () => import('@/layouts/FormLayout.vue'),
          children: [
            {
              path: 'suggestions',
              name: 'formSuggestions',
              component: () => import('@/views/forms/FormSuggestionView.vue'),
              meta: { title: 'Suggestions' }
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

router.beforeEach(async (to, from, next) => {
  const isAuthenticated = authService.isAuthenticated()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isGuestOnly = to.matched.some(record => record.meta.guest)

  if (to.meta.title) {
    document.title = `${to.meta.title} | TLC-SUGGEST`
  } else {
    document.title = 'TLC-SUGGEST'
  }

  if (requiresAuth && !isAuthenticated) {
    next({
      name: 'SignIn',
      query: { redirect: to.fullPath }
    })
  }
  else if (isGuestOnly && isAuthenticated) {
    const redirectPath = (to.query.redirect as string) || '/'
    next(redirectPath)
  }
  else {
    next()
  }
})

export default router
