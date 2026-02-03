<template>
  <nav class="flex items-center space-x-2 text-sm">
    <router-link
      v-for="(crumb, index) in breadcrumbs"
      :key="index"
      :to="crumb.to"
      class="flex items-center space-x-2 group"
    >
      <span
        class="transition-colors duration-200"
        :class="index === breadcrumbs.length - 1
          ? 'text-text-base font-medium'
          : 'text-text-muted hover:text-primary'
        "
      >
        {{ crumb.label }}
      </span>
      <IconChevronRight
        v-if="index < breadcrumbs.length - 1"
        class="w-4 h-4 text-text-muted"
      />
    </router-link>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { IconChevronRight } from '@tabler/icons-vue'
import type { RouteLocationRaw } from 'vue-router'

const route = useRoute()

interface Breadcrumb {
  label: string
  to: RouteLocationRaw
}

const breadcrumbs = computed((): Breadcrumb[] => {
  const crumbs: Breadcrumb[] = [
    { label: 'Home', to: { name: 'dashboard' } }
  ]

  if (route.name === 'forms') {
    crumbs.push({ label: 'Forms', to: { name: 'forms' } })
  }

  if (route.params.id) {
    const formTitle = (route.query.title as string) || 'Form'

    crumbs.push({ label: 'Forms', to: { name: 'forms' } })
    crumbs.push({
      label: formTitle,
      to: {
        name: '',
        params: { id: route.params.id },
        query: { title: formTitle }
      }
    })

    if (route.name === 'formSuggestions') {
      crumbs.push({
        label: 'List',
        to: {
          name: 'formSuggestions',
          params: { id: route.params.id },
          query: { title: formTitle }
        }
      })
    } else if (route.name === 'formSummary') {
      crumbs.push({
        label: 'Summary',
        to: {
          name: 'formSummary',
          params: { id: route.params.id },
          query: { title: formTitle }
        }
      })
    }
  }

  if (route.name === 'reports') {
    crumbs.push({ label: 'Reports', to: { name: 'reports' } })
  }

  if (route.name === 'trash') {
    crumbs.push({ label: 'Trash', to: { name: 'trash' } })
  }

  return crumbs
})
</script>
