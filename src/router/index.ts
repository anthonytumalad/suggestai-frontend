import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/signin',
      name: 'signIn',
      component: () => import('@/views/auth/SignInView.vue'),
      meta: { title: 'Sign in', guest: true }
    }
  ],
})

export default router
