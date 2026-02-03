<template>
  <div>
    <div class="flex border-b border-border-muted px-2">
      <button
        v-for="tab in tabs"
        :key="tab.name"
        @click="selectTab(tab.name)"
        class="cursor-pointer px-4 py-2 text-sm border-b-2 transition" :class="isActive(tab.name)
          ? 'border-primary text-primary'
          : 'border-transparent text-text-muted hover:text-text-base hover:border-border-muted'"
      >
        {{ tab.label }}
      </button>
    </div>
    <div class="py-8">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const formId = route.params.id
const formTitle = route.query.title

const tabs = [
  { label: 'Overview', name: '' },
  { label: 'List', name: 'formSuggestions' },
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
</script>
