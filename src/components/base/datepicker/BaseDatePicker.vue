<template>
  <div class="date-range-picker flex items-center space-x-2 text-text-base">
    <select
      v-model="selectedFilter"
      class="bg-bg-primary border border-border-muted rounded px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
    >
      <option
        v-for="opt in filterOptions"
        :key="opt.value" :value="opt.value"
      >
        {{ opt.label }}
      </option>
    </select>

    <div
      v-if="selectedFilter === 'all'"
      class="border border-border-muted rounded px-3 py-1 text-sm bg-base min-w-45"
    >
      All Dates
    </div>

    <div
      v-else-if="selectedFilter === 'today'"
      class="border border-border-muted rounded px-3 py-1 text-sm bg-base min-w-45"
    >
      {{ displayDay || '—' }}
    </div>

    <div
      v-else class="flex items-center gap-2"
    >
      <div
        v-if="selectedFilter !== 'custom'"
        class="bg-bg-primary border border-border-muted rounded px-3 py-1 text-sm bg-base min-w-45"
      >
        {{ displayRange || '—' }}
      </div>

      <div
        v-else
        class="flex items-center gap-2 rounded bg-bg-primary border border-border-muted px-3 py-1"
      >
        <input
          type="date"
          class="border-none outline-none text-sm w-32" :value="formatDate(startDate)"
          @input="startDate = parseDate(($event.target as HTMLInputElement).value)"
        />
        <span class="text-text-muted">→</span>
        <input
          type="date"
          class="border-none outline-none text-sm w-32"
          :value="formatDate(endDate)"
          @input="endDate = parseDate(($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps < {
  modelValue?: { start: Date | null; end: Date | null }
} > ()

const emit = defineEmits < {
  (e: 'update:modelValue', value: { start: Date | null; end: Date | null }): void
  (e: 'filter-change', value: { start: Date | null; end: Date | null }): void
}> ()

type FilterType = 'all' | 'today' | 'last7' | 'thisMonth' | 'custom'

const filterOptions: { label: string; value: FilterType }[] = [
  { label: 'All Dates', value: 'all' },
  { label: 'Today', value: 'today' },
  { label: 'Last 7 days', value: 'last7' },
  { label: 'This month', value: 'thisMonth' },
  { label: 'Custom', value: 'custom' },
]

const selectedFilter = ref < FilterType > ('all')
const startDate = ref < Date | null > (null)
const endDate = ref < Date | null > (null)

watch(
  () => ({ start: startDate.value, end: endDate.value }),
  (val) => {
    emit('update:modelValue', val)
    emit('filter-change', val)
  },
  { deep: true }
)

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      startDate.value = val.start
      endDate.value = val.end

      if (!val.start && !val.end) {
        selectedFilter.value = 'all'
      } else if (val.start && val.end) {
        const now = new Date()
        const diffDays = Math.round(
          (val.end.getTime() - val.start.getTime()) / (86400000)
        )

        const isToday = val.start.toDateString() === now.toDateString() && diffDays === 0
        const isLast7 = diffDays === 6 && val.end.toDateString() === new Date().toDateString()

        const startThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const isThisMonth =
          val.start.getTime() === startThisMonth.getTime() &&
          val.end.toDateString() === new Date().toDateString()

        if (isToday) selectedFilter.value = 'today'
        else if (isLast7) selectedFilter.value = 'last7'
        else if (isThisMonth) selectedFilter.value = 'thisMonth'
        else selectedFilter.value = 'custom'
      } else {
        selectedFilter.value = 'custom'
      }
    }
  },
  { immediate: true, deep: true }
)

const getPresetRange = (mode: FilterType) => {
  if (mode === 'all') {
    return { start: null, end: null }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let start: Date | null = new Date(today)
  const end = new Date(today)
  end.setHours(23, 59, 59, 999)

  if (mode === 'today') {
    // already set
  } else if (mode === 'last7') {
    start.setDate(start.getDate() - 6)
  } else if (mode === 'thisMonth') {
    start = new Date(today.getFullYear(), today.getMonth(), 1)
  }

  return { start, end }
}

watch(
  selectedFilter,
  (mode) => {
    if (mode !== 'custom') {
      const range = getPresetRange(mode)
      startDate.value = range.start
      endDate.value = range.end
    }
  },
  { immediate: true }
)

const formatDate = (d: Date | null) => (d ? d.toISOString().split('T')[0] : '')
const parseDate = (s: string) => (s ? new Date(s) : null)

const displayDay = computed(() => {
  if (!startDate.value) return ''
  return startDate.value.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
})

const displayRange = computed(() => {
  if (startDate.value === null && endDate.value === null) {
    return 'All Dates'
  }

  if (!startDate.value || !endDate.value) return '—'

  const startStr = startDate.value.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
  const endStr = endDate.value.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: endDate.value.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  })

  return `${startStr} – ${endStr}`
})
</script>

<style scoped>
input[type='date']::-webkit-calendar-picker-indicator {
  cursor: pointer;
}

input[type='date']:focus,
select:focus {
  outline: none;
}
</style>
