<template>
  <BaseTable
    :columns="columns"
    :items="suggestion"
    :query="query"
    :page="page"
    :per-page="perPage"
    :total="total"
    @update:page="emit('update:page', $event)"
  >
    <template #cell-student="{ item }">
      <div class="flex items-center space-x-4">

        <div
          v-if="item.is_anonymous"
          class="w-8 h-8 rounded-full bg-bg-muted flex items-center justify-center text-secondary text-xs font-medium"
        >
          <IconUser stroke={2} class="w-5 h-5 text-text-muted" />
        </div>

        <div
          v-else-if="item.profile_picture"
          class="w-8 h-8 rounded-full overflow-hidden bg-bg-muted"
        >
          <img
            :src="item.profile_picture"
            :alt="item.student_email || 'Student'" class="w-full h-full object-cover"
            @error="($event.target as HTMLImageElement).src = ''"
          />
        </div>

        <div
          v-else
          class="w-8 h-8 rounded-full bg-text-base/10 flex items-center justify-center text-primary text-xs font-medium"
        >
          {{ getInitials(item.student_email) }}
        </div>

        <div class="flex flex-col">
          <span
            v-if="item.is_anonymous"
            class="text-sm text-text-muted italic"
          >
            Anonymous
          </span>
          <span
            v-else-if="item.student_email"
            class="text-sm"
          >
            {{ item.student_email }}
          </span>
          <span
            v-else class="text-sm text-text-muted italic"
          >
            No email
          </span>
        </div>

      </div>
    </template>

            <template #cell-created_at="{ item }">
          <span class="text-sm">
            {{ formatDate(item.created_at) }}
          </span>
        </template>
  </BaseTable>
</template>

<script setup lang="ts">
import type { Suggestion } from '@/services/formService'
import BaseTable, { type Column } from '../BaseTable.vue'
import { IconUser } from '@tabler/icons-vue'

defineProps<{
  suggestion: Suggestion[],
  columns: Column<Suggestion>[],
  query: { isLoading: boolean; isFetching: boolean }
  page: number
  perPage: number
  total: number
}>()

const emit = defineEmits<{
  (e: 'update:page', value: number): void
  (e: 'update:perPage', value: number): void
}>()

const getInitials = (email: string | null | undefined) => {
  if (!email) return '?'
  const name = email.split('@')[0]
  if (!name) return '?'
  return name.substring(0, 2).toUpperCase()
}

const formatDate = (date: Date) => {
  const dateStr = new Date(date).toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
  const timeStr = new Date(date).toLocaleTimeString('en-PH', {
    hour: '2-digit',
    minute: '2-digit'
  })
  return `${dateStr} at ${timeStr}`
}
</script>
