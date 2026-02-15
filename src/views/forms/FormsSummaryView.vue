<!-- pages/TopicSessionsPage.vue -->
<template>
  <div class="container mx-auto p-6">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Topic Analysis Sessions</h1>
        <p class="text-text-muted">View and manage your topic modeling sessions</p>
      </div>
    </div>

    <BaseTable
      :columns="columns"
      :items="paginatedSessions"
      :query="sessionsQuery"
      :page="page"
      :per-page="perPage"
      :total="total"
      @update:page="page = $event"
      @update:per-page="perPage = $event"
      @row-click="handleRowClick"
      @sort="handleSort"
    >
      <!-- Custom slot for date range -->
      <template #cell-date_range="{ item }">
        <div class="text-sm">
          {{ formatDateRange(item) }}
        </div>
      </template>

      <!-- Custom slot for topics -->
      <template #cell-total_topics="{ item }">
        <div class="flex items-center gap-2">
          <span>{{ item.total_topics }}</span>
          <span class="text-xs text-text-muted">({{ item.outliers }} outliers)</span>
        </div>
      </template>

      <!-- Custom slot for status/duplicate indicator -->
      <template #cell-status="{ item }">
        <div class="flex items-center gap-2">
          <span
            v-if="hasDuplicates(item)"
            class="inline-flex items-center px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800"
            title="Duplicate date range detected"
          >
            ⚠️ Duplicate
          </span>
          <span
            v-else
            class="inline-flex items-center px-2 py-1 rounded text-xs bg-green-100 text-green-800"
          >
            ✓ Unique
          </span>
        </div>
      </template>

      <!-- Custom slot for created_at -->
      <template #cell-created_at="{ item }">
        <div class="text-sm">
          {{ formatDate(item.created_at) }}
        </div>
      </template>

      <!-- Custom slot for actions -->
      <template #cell-actions="{ item }">
        <div class="flex gap-2" @click.stop>
          <button
            @click="viewSession(item.id)"
            class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            View
          </button>
          <button
            @click="confirmDelete(item)"
            :disabled="isDeletingSession"
            class="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </template>
    </BaseTable>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseTable, { type Column } from '@/components/base/table/BaseTable.vue'
import { useTopicSessions } from '@/composables/forms/useTopicSessions'
import type { TopicSession } from '@/services/formService'

const route = useRoute()
const router = useRouter()

const formId = computed(() => Number(route.params.formId))
const page = ref(1)
const perPage = ref(15)

const {
  sessionsQuery,
  paginatedSessions,
  total,
  hasDuplicates,
  deleteSession,
  isDeletingSession,
} = useTopicSessions({ formId, page, perPage })

const columns: Column<TopicSession>[] = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Session Name', sortable: true },
  { key: 'date_range', label: 'Date Range', slot: true },
  { key: 'total_topics', label: 'Topics', slot: true, sortable: true },
  { key: 'total_documents', label: 'Documents', sortable: true },
  { key: 'created_at', label: 'Created', slot: true, sortable: true },
  { key: 'status', label: 'Status', slot: true },
  { key: 'actions', label: 'Actions', slot: true },
]

const formatDateRange = (session: TopicSession) => {
  const range = session.model_parameters?.date_range
  if (!range?.start && !range?.end) return 'All time'

  const start = range.start ? new Date(range.start).toLocaleDateString() : 'Start'
  const end = range.end ? new Date(range.end).toLocaleDateString() : 'End'

  return `${start} – ${end}`
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) return `${diffMins} minutes ago`
  if (diffHours < 24) return `${diffHours} hours ago`
  if (diffDays < 7) return `${diffDays} days ago`

  return date.toLocaleDateString()
}

const handleRowClick = (session: TopicSession) => {
  viewSession(session.id)
}

const viewSession = (sessionId: number) => {
  router.push({
    name: 'TopicSessionDetails',
    params: { formId: formId.value, sessionId }
  })
}

const confirmDelete = async (session: TopicSession) => {
  try {
    await deleteSession(session.id)
  } catch (error) {
    console.error('Failed to delete session:', error)
  }
}

const handleSort = (payload: { key: string; direction: 'asc' | 'desc' | null }) => {
  console.log('Sort:', payload)
  // Implement sorting logic if needed
}
</script>
