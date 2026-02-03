<template>
  <BaseTable
    :columns="columns"
    :items="forms"
    :query="query"
    :page="page"
    :per-page="perPage"
    :total="total"
    @update:page="emit('update:page', $event)"
    @update:per-page="emit('update:perPage', $event)"
    @row-click="emit('row-click', $event)"
  >
    <template #cell-title="{ item }">
      <span
        class="
          transition-all duration-300 text-sm cursor-pointer
          group-hover:text-primary group-hover:underline
        "
      >
        {{ item.title }}
      </span>
    </template>
    <template #cell-is_active="{ item }">
      <div class="flex items-center gap-2">
        <span
          class="w-2 h-2 rounded-full"
          :class="item.is_active ? 'bg-green-500' : 'bg-red-500'"
        ></span>
        <span>{{ item.is_active ? 'Active' : 'Not Active' }}</span>
      </div>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import BaseTable from '../BaseTable.vue'
import type { Column } from '../BaseTable.vue'

export interface FormItems {
  id: number
  title: string
  suggestions_count: number
  is_active: boolean
}

defineProps<{
  forms: FormItems[]
  columns: Column < FormItems > []
  query: { isLoading: boolean; isFetching: boolean }
  page: number
  perPage: number
  total: number
}>()

const emit = defineEmits < {
  'update:page': [page: number]
  'update:perPage': [perPage: number]
  'row-click': [item: FormItems]
}>()
</script>
