<template>
  <div>
    <!-- Form Header -->
    <div class="flex items-center gap-6 px-6 pt-6 pb-4">
      <h1 class="text-3xl font-medium text-text-base">
        {{ formTitle || '...' }}
      </h1>
      <div class="flex items-center gap-3">
        <button
          class="flex items-center gap-1.5 text-sm py-1.5 text-text-muted hover:text-primary transition-colors duration-300 cursor-pointer"
          @click="handleEdit"
        >
          <IconPencil class="w-4 h-4" />
          Edit
        </button>
        <button
          class="flex items-center gap-1.5 text-sm py-1.5 text-text-muted hover:text-primary transition-colors duration-300 cursor-pointer"
          @click="handleShow"
        >
          <IconExternalLink class="w-4 h-4" />
          Show
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex border-b border-border-muted px-2">
      <button
        v-for="tab in tabs"
        :key="tab.name"
        @click="selectTab(tab.name)"
        class="cursor-pointer px-4 py-2 text-sm border-b-2 transition"
        :class="isActive(tab.name)
          ? 'border-primary text-primary font-medium'
          : 'border-transparent text-text-muted hover:text-text-base hover:border-border-muted'"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab Content -->
    <div class="py-8 px-6 mx-auto">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { IconPencil, IconExternalLink } from '@tabler/icons-vue'

const route = useRoute()
const router = useRouter()

const formId = route.params.id
const formTitle = route.query.title

const tabs = [
  { label: 'Overview', name: 'formOverview' },
  { label: 'Suggestions', name: 'formSuggestions' },
  { label: 'Summary', name: 'formSummary' },
]

const selectTab = (tabName: string) => {
  if (route.name !== tabName) {
    router.push({
      name: tabName,
      params: { id: formId },
      query: { title: formTitle }
    })
  }
}

const isActive = (tabName: string) => route.name === tabName

const handleEdit = () => {
  router.push({
    name: 'editForm',
    params: { id: formId },
    query: { title: formTitle }
  })
}

const handleShow = () => {
  // open public form link
}
</script>
