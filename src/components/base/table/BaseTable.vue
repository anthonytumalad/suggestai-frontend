<template>
  <div class="space-y-6">

    <div
      v-if="(query?.isLoading || query?.isFetching) && items.length === 0"
      class="flex items-center justify-center gap-2 py-10 text-text-muted border-y border-border-muted"
    >
      <IconLoader class="animate-spin mr-2 h-5 w-5"/>
    </div>

    <div
      v-else-if="items.length === 0"
      class="text-center py-10 text-text-muted border-y border-border-muted"
    >
      No records found
    </div>

    <div
      v-else
      class="overflow-x-auto rounded relative"
    >
      <div
        v-if="query?.isFetching"
        class="absolute inset-0 bg-bg-primary/60 flex items-center justify-center z-10 rounded"
      >
        <IconLoader class="animate-spin h-5 w-5 text-text-muted" />
      </div>
      <table class="min-w-full">
        <thead class="border-b border-border-muted">
          <tr>
            <th v-if="selectable" class="px-4 py-3 w-10">
              <input
                type="checkbox"
                class="rounded border-border-muted cursor-pointer accent-primary"
                :checked="isAllSelected"
                :indeterminate="isIndeterminate"
                @change="toggleSelectAll"
              />
            </th>
            <th
              v-for="col in columns"
              :key="String(col.key)"
              class="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase"
              :class="{ 'cursor-pointer hover:bg-bg-muted': col.sortable }"
              @click="col.sortable ? toggleSort(String(col.key)) : null"
            >
              <div class="flex items-center gap-1">
                {{ col.label }}
                <component
                  v-if="col.sortable"
                  :is="getSortIcon(String(col.key))"
                  :size="16"
                  class="text-text-muted"
                />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in items"
            :key="getRowKey(item)"
            class="hover:bg-bg-muted transition-colors cursor-pointer border-b border-border-muted"
            :class="{ 'bg-bg-muted/60': selectable && isSelected(item) }"
            @click="emit('row-click', item)"
          >
            <td v-if="selectable" class="px-4 py-4 w-10" @click.stop>
              <input
                type="checkbox"
                class="rounded border-border-muted cursor-pointer accent-primary"
                :checked="isSelected(item)"
                @change="toggleRow(item)"
              />
            </td>

            <td
              v-for="col in columns"
              :key="String(col.key)"
              class="group px-6 py-4 text-sm text-text-base whitespace-nowrap"
            >
              <slot
                v-if="col.slot"
                :name="`cell-${String(col.key)}`"
                :item="item"
              />
              <template v-else>
                {{ item[col.key as keyof T] }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex items-center justify-between text-text-muted text-sm">
      <div class="">
        Showing
        <span>{{ (page - 1) * perPage + 1 }}</span>
        –
        <span>{{ Math.min(page * perPage, total) }}</span>
        of
        <span>{{ total }}</span> results
      </div>

      <div class="flex items-center space-x-2">
        <select
          :value="perPage"
          @change="emit('update:perPage', Number(($event.target as HTMLSelectElement).value))"
          class="border border-border-muted px-3 py-1 rounded cursor-pointer"
        >
          <option
            v-for="size in resolvedPageSizes"
            :key="size"
            :value="size"
          >
            {{ size }} per page
          </option>
        </select>

        <button
          class="border border-border-muted px-3 py-1 rounded cursor-pointer hover:bg-bg-muted
          disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="page <= 1" @click="emit('update:page', page - 1)">
          Previous
        </button>

        <span>Page <span>{{ page }}</span> of <span>{{ Math.max(1, Math.ceil(total / perPage)) }}</span></span>

        <button
          class="px-3 py-1 border border-border-muted rounded hover:bg-bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="page >= Math.ceil(total / perPage)" @click="emit('update:page', page + 1)">
          Next
        </button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
import { ref, watch, computed } from 'vue'
import { IconLoader, IconArrowsSort, IconSortAscending, IconSortDescending } from '@tabler/icons-vue'

export interface Column<T> {
  key: keyof T | string
  label: string
  sortable?: boolean
  slot?: boolean
}

type SortDirection = 'asc' | 'desc' | null

const props = defineProps < {
  columns: Column < T > []
  items: T[]
  query?: { isLoading: boolean; isFetching: boolean }
  page: number
  perPage: number
  total: number
  rowKey?: keyof T | string
  pageSizeOptions ?: number[]
  selectable?: boolean
}>()

const emit = defineEmits < {
  (e: 'update:page', value: number): void
  (e: 'update:perPage', value: number): void
  (e: 'sort', payload: { key: string; direction: SortDirection }): void
  (e: 'row-click', item: T): void
  (e: 'update:selected', items: T[]): void
}>()

const currentSort = ref<{ key: string; direction: SortDirection }>({ key: '', direction: null })

const resolvedPageSizes = props.pageSizeOptions ?? [10, 15, 20, 50, 100]

const toggleSort = (key: string) => {
  if (currentSort.value.key === key) {
    if (currentSort.value.direction === 'asc') {
      currentSort.value.direction = 'desc'
    } else if (currentSort.value.direction === 'desc') {
      currentSort.value = { key: '', direction: null }
    } else {
      currentSort.value.direction = 'asc'
    }
  } else {
    currentSort.value = { key, direction: 'asc' }
  }
  emit('sort', currentSort.value)
}

const getSortIcon = (key: string) => {
  if (currentSort.value.key === key) {
    return currentSort.value.direction === 'asc' ? IconSortAscending : IconSortDescending
  }
  return IconArrowsSort
}

const getRowKey = (item: T): string => {
  if (props.rowKey) return String(item[props.rowKey as keyof T] ?? '')
  if ('id' in item && item.id != null) return String(item.id)
  return JSON.stringify(item)
}

const selectedKeys = ref<Set<string>>(new Set())

const isSelected = (item: T) =>
  selectedKeys.value.has(getRowKey(item))

const isAllSelected = computed(() =>
  props.items.length > 0 &&
  props.items.every(item => selectedKeys.value.has(getRowKey(item)))
)

const isIndeterminate = computed(() =>
  props.items.some(item => selectedKeys.value.has(getRowKey(item))) &&
  !isAllSelected.value
)

const toggleRow = (item: T) => {
  const key  = getRowKey(item)
  const next = new Set(selectedKeys.value)
  next.has(key) ? next.delete(key) : next.add(key)
  selectedKeys.value = next
  emitSelected()
}

const toggleSelectAll = () => {
  const next = new Set(selectedKeys.value)
  if (isAllSelected.value) {
    props.items.forEach(item => next.delete(getRowKey(item)))
  } else {
    props.items.forEach(item => next.add(getRowKey(item)))
  }
  selectedKeys.value = next
  emitSelected()
}

const emitSelected = () => {
  emit('update:selected', props.items.filter(item =>
    selectedKeys.value.has(getRowKey(item))
  ))
}

watch(() => props.items, () => {
  selectedKeys.value = new Set()
  emit('update:selected', [])
})

watch(() => props.perPage, (newVal, oldVal) => {
  if (newVal !== oldVal) emit('update:page', 1)
})
</script>
