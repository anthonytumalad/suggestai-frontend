<template>
  <BaseTable
    :columns="columns"
    :items="sessions"
    :query="query"
    :page="page"
    :per-page="perPage"
    :total="total"
    @update:page="emit('update:page', $event)"
    @update:per-page="emit('update:perPage', $event)"
    @row-click="emit('row-click', $event)"
    :selectable="true"
  >
    <template #cell-name="{ item }">
      <span class="transition-all duration-300 text-sm cursor-pointer group-hover:text-primary group-hover:underline">
        {{ item.name }}
      </span>
    </template>

    <template #cell-date_range="{ item }">
      <span class="text-sm text-text-muted">
        {{ formatDateRange(item.date_range) }}
      </span>
    </template>

    <template #cell-total_topics="{ item }">
      <span class="font-medium text-text-base">{{ item.total_topics }}</span>
    </template>

    <template #cell-total_documents="{ item }">
      <span class="font-medium text-text-base">{{ item.total_documents }}</span>
    </template>

    <template #cell-outliers="{ item }">
      <span class="text-text-muted">{{ item.outliers }}</span>
    </template>

    <template #cell-status="{ item }">
      <span
        class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium uppercase tracking-wide"
        :class="item.status === 'completed'
          ? 'bg-green-50 text-green-700 border border-green-200'
          : 'bg-bg-muted text-text-muted border border-border-muted'"
      >
        <span
          class="w-1.5 h-1.5 rounded-full"
          :class="item.status === 'completed' ? 'bg-green-500' : 'bg-text-muted'"
        />
        {{ item.status }}
      </span>
    </template>

    <template #cell-created_at="{ item }">
      <span class="text-sm text-text-muted">{{ formatDate(item.created_at) }}</span>
    </template>

    <template #cell-actions="{ item }">
      <div class="flex items-center gap-2" @click.stop>
        <button
          class="text-xs text-text-muted hover:text-red-500 transition-colors disabled:opacity-40"
          :disabled="isDeletingSession"
          @click="emit('delete', item)"
        >
          Delete
        </button>
      </div>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import BaseTable from '../BaseTable.vue'
import type { Column } from '../BaseTable.vue'

export interface SessionItem {
  id: number
  name: string
  total_topics: number
  total_documents: number
  outliers: number
  status: string
  created_at: string
  date_range: { start: string | null; end: string | null }
}

defineProps<{
  sessions: SessionItem[]
  columns: Column<SessionItem>[]
  query: { isLoading: boolean; isFetching: boolean }
  page: number
  perPage: number
  total: number
  isDeletingSession?: boolean
}>()

const emit = defineEmits<{
  'update:page': [page: number]
  'update:perPage': [perPage: number]
  'row-click': [item: SessionItem]
  'delete': [item: SessionItem]
}>()

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    .format(new Date(date))

const formatDateRange = (range: { start: string | null; end: string | null }) => {
  if (!range?.start && !range?.end) return 'All Time'
  if (range.start && range.end)     return `${formatDate(range.start)} – ${formatDate(range.end)}`
  if (range.start)                  return `From ${formatDate(range.start)}`
  return `Until ${formatDate(range.end!)}`
}
</script>
