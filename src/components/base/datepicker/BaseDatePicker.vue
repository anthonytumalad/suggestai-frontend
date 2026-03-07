<template>
  <div class="relative inline-block text-text-base" ref="pickerRef">

    <!-- Trigger Button -->
    <button
      class="flex items-center gap-2 px-4 py-1.5 text-sm text-text-base bg-white border border-border-muted rounded hover:bg-bg-muted transition-colors duration-150 cursor-pointer"
      :class="{ 'opacity-50 cursor-not-allowed pointer-events-none': disabled }"
      @click="toggleCalendar"
    >
      <IconCalendar class="size-3.75 text-text-muted shrink-0" />
      <span class="flex-1 text-left whitespace-nowrap">{{ displayText }}</span>
      <IconChevronDown
        class="size-3.5 text-text-muted shrink-0 transition-transform duration-300"
        :class="{ 'rotate-180': calendarOpen }"
      />
    </button>

    <!-- Calendar Dropdown -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 -translate-y-1.5"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1.5"
    >
      <div
        v-if="calendarOpen"
        class="absolute top-[calc(100%+6px)] left-0 z-50 bg-white border border-border-muted rounded shadow-lg flex overflow-hidden"
        style="width: fit-content"
      >
        <!-- Left Sidebar: Presets -->
        <div class="flex flex-col border-r border-border-muted py-1.5 w-36 shrink-0">
          <button
            v-for="opt in filterOptions"
            :key="opt.value"
            class="px-3.5 py-1.5 text-sm text-left cursor-pointer transition-colors duration-100 whitespace-nowrap"
            :class="selectedFilter === opt.value
              ? 'bg-primary/8 text-primary font-medium'
              : 'text-text-muted hover:bg-bg-muted hover:text-text-base'"
            @click="selectPreset(opt.value)"
          >
            {{ opt.label }}
          </button>
        </div>

        <!-- Calendar panels -->
        <div v-if="selectedFilter !== 'all'" class="flex flex-col">
          <div class="flex">
            <!-- Left Month -->
            <div class="p-4" style="width: 220px">
              <div class="flex items-center justify-between mb-2.5">
                <button
                  class="w-6 h-6 flex items-center justify-center rounded border border-border-muted text-text-muted hover:bg-bg-muted hover:text-text-base transition-all duration-150 cursor-pointer bg-white"
                  @click="prevMonth"
                >
                  <IconChevronLeft class="size-3" />
                </button>
                <span class="text-xs font-semibold text-text-base select-none">
                  {{ monthLabel(leftYear, leftMonth) }}
                </span>
                <button
                  class="w-6 h-6 flex items-center justify-center rounded border border-border-muted text-text-muted hover:bg-bg-muted hover:text-text-base transition-all duration-150 cursor-pointer bg-white"
                  @click="nextMonthLeft"
                >
                  <IconChevronRight class="size-3" />
                </button>
              </div>
              <div class="grid grid-cols-7">
                <span
                  v-for="d in dayNames" :key="d"
                  class="text-center text-[9px] font-semibold text-text-muted uppercase tracking-wide pb-1"
                >{{ d }}</span>
                <span v-for="n in firstDayOffset(leftYear, leftMonth)" :key="'lb'+n"></span>
                <button
                  v-for="day in daysInMonth(leftYear, leftMonth)"
                  :key="'ld'+day"
                  class="relative flex items-center justify-center text-[11px] border-none cursor-pointer transition-all duration-100"
                  :class="dayClass(leftYear, leftMonth, day)"
                  style="aspect-ratio:1"
                  @click="selectDay(leftYear, leftMonth, day)"
                  @mouseenter="hoverDay(leftYear, leftMonth, day)"
                >
                  {{ day }}
                  <span
                    v-if="isTodayDot(leftYear, leftMonth, day)"
                    class="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-0.5 h-0.5 rounded-full bg-primary"
                  ></span>
                </button>
              </div>
            </div>

            <div class="w-px bg-border-muted my-3 shrink-0"></div>

            <!-- Right Month -->
            <div class="p-4" style="width: 220px">
              <div class="flex items-center justify-between mb-2.5">
                <button
                  class="w-6 h-6 flex items-center justify-center rounded border border-border-muted text-text-muted hover:bg-bg-muted hover:text-text-base transition-all duration-150 cursor-pointer bg-white"
                  @click="prevMonthRight"
                >
                  <IconChevronLeft class="size-3" />
                </button>
                <span class="text-xs font-semibold text-text-base select-none">
                  {{ monthLabel(rightYear, rightMonth) }}
                </span>
                <button
                  class="w-6 h-6 flex items-center justify-center rounded border border-border-muted text-text-muted hover:bg-bg-muted hover:text-text-base transition-all duration-150 cursor-pointer bg-white"
                  @click="nextMonth"
                >
                  <IconChevronRight class="size-3" />
                </button>
              </div>
              <div class="grid grid-cols-7">
                <span
                  v-for="d in dayNames" :key="d"
                  class="text-center text-[9px] font-semibold text-text-muted uppercase tracking-wide pb-1"
                >{{ d }}</span>
                <span v-for="n in firstDayOffset(rightYear, rightMonth)" :key="'rb'+n"></span>
                <button
                  v-for="day in daysInMonth(rightYear, rightMonth)"
                  :key="'rd'+day"
                  class="relative flex items-center justify-center text-[11px] border-none cursor-pointer transition-all duration-100"
                  :class="dayClass(rightYear, rightMonth, day)"
                  style="aspect-ratio:1"
                  @click="selectDay(rightYear, rightMonth, day)"
                  @mouseenter="hoverDay(rightYear, rightMonth, day)"
                >
                  {{ day }}
                  <span
                    v-if="isTodayDot(rightYear, rightMonth, day)"
                    class="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-0.5 h-0.5 rounded-full bg-primary"
                  ></span>
                </button>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between px-4 py-2.5 border-t border-border-muted bg-bg-muted">
            <div class="flex items-center gap-1.5 text-xs text-text-muted italic">
              <IconInfoCircle class="size-3" />
              {{ selectionStep === 0 ? 'Select start date' : 'Select end date' }}
            </div>
            <div class="flex items-center gap-2">
              <button
                class="px-3 py-1 text-xs border border-border-muted rounded text-text-muted hover:text-text-base transition-all duration-150 cursor-pointer bg-white"
                @click="clearDates"
              >
                Clear
              </button>
              <button
                class="px-3 py-1 text-xs rounded bg-primary text-white hover:opacity-90 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                :disabled="!tempStart"
                @click="applyDates"
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        <!-- All dates state -->
        <div v-else class="flex items-center justify-center px-8 py-6 text-sm text-text-muted italic">
          Showing all dates
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import {
  IconCalendar,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconInfoCircle,
} from '@tabler/icons-vue'

const props = defineProps<{
  modelValue?: { start: Date | null; end: Date | null }
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: { start: Date | null; end: Date | null }): void
  (e: 'filter-change', value: { start: Date | null; end: Date | null }): void
}>()

type FilterType = 'all' | 'today' | 'last7' | 'thisMonth' | 'custom'

const filterOptions: { label: string; value: FilterType }[] = [
  { label: 'All', value: 'all' },
  { label: 'Today', value: 'today' },
  { label: 'Last 7 days', value: 'last7' },
  { label: 'This month', value: 'thisMonth' },
  { label: 'Custom', value: 'custom' },
]

const selectedFilter = ref<FilterType>('all')
const startDate = ref<Date | null>(null)
const endDate = ref<Date | null>(null)
const calendarOpen = ref(false)
const pickerRef = ref<HTMLElement | null>(null)

const now = new Date()
const leftMonth = ref(now.getMonth())
const leftYear = ref(now.getFullYear())

const rightMonth = computed(() => (leftMonth.value + 1) % 12)
const rightYear = computed(() => leftMonth.value === 11 ? leftYear.value + 1 : leftYear.value)

const selectionStep = ref(0)
const tempStart = ref<Date | null>(null)
const tempEnd = ref<Date | null>(null)
const hoverDate = ref<Date | null>(null)

const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']
const shortMonths = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const monthLabel = (y: number, m: number) => `${monthNames[m]} ${y}`
const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate()
const firstDayOffset = (y: number, m: number) => new Date(y, m, 1).getDay()

function prevMonth() {
  if (leftMonth.value === 0) { leftMonth.value = 11; leftYear.value-- }
  else leftMonth.value--
}
function nextMonth() {
  if (leftMonth.value === 11) { leftMonth.value = 0; leftYear.value++ }
  else leftMonth.value++
}
function nextMonthLeft() { nextMonth() }
function prevMonthRight() { prevMonth() }

function makeDate(y: number, m: number, d: number) {
  const dt = new Date(y, m, d); dt.setHours(0, 0, 0, 0); return dt
}

function selectDay(y: number, m: number, d: number) {
  const dt = makeDate(y, m, d)
  if (selectionStep.value === 0) {
    tempStart.value = dt; tempEnd.value = null; selectionStep.value = 1
  } else {
    if (dt < tempStart.value!) { tempEnd.value = tempStart.value; tempStart.value = dt }
    else tempEnd.value = dt
    selectionStep.value = 0
  }
}

function hoverDay(y: number, m: number, d: number) {
  if (selectionStep.value === 1) hoverDate.value = makeDate(y, m, d)
}

function isTodayDot(y: number, m: number, d: number): boolean {
  const dt = makeDate(y, m, d)
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const start = tempStart.value
  const end = tempEnd.value || (selectionStep.value === 1 ? hoverDate.value : null)
  const isStart = !!(start && dt.getTime() === start.getTime())
  const isEnd = !!(end && dt.getTime() === end.getTime())
  return dt.getTime() === today.getTime() && !isStart && !isEnd
}

function dayClass(y: number, m: number, d: number): string {
  const dt = makeDate(y, m, d)
  const start = tempStart.value
  const end = tempEnd.value || (selectionStep.value === 1 ? hoverDate.value : null)
  const today = new Date(); today.setHours(0, 0, 0, 0)

  const isStart = !!(start && dt.getTime() === start.getTime())
  const isEnd = !!(end && dt.getTime() === end.getTime())
  const inRange = !!(start && end && dt > start && dt < end)
  const isToday = dt.getTime() === today.getTime()
  const isSingle = isStart && (!end || dt.getTime() === end.getTime())

  if (isSingle && isStart) return 'bg-primary text-white font-semibold rounded hover:opacity-90'
  if (isStart) return 'bg-primary text-white font-semibold hover:opacity-90 rounded-l rounded-r-none'
  if (isEnd) return 'bg-primary text-white font-semibold hover:opacity-90 rounded-r rounded-l-none'
  if (inRange) return 'bg-primary/10 text-text-base rounded-none hover:bg-primary/15'
  if (isToday) return 'font-semibold text-primary rounded hover:bg-bg-muted'
  return 'font-normal text-text-base rounded hover:bg-bg-muted'
}

function applyDates() {
  const s = tempStart.value
  let e = tempEnd.value
  if (s && !e) { e = new Date(s); e.setHours(23, 59, 59, 999) }
  else if (e) { e = new Date(e); e.setHours(23, 59, 59, 999) }
  startDate.value = s; endDate.value = e
  selectedFilter.value = 'custom'
  calendarOpen.value = false
  emit('update:modelValue', { start: s, end: e })
  emit('filter-change', { start: s, end: e })
}

function clearDates() {
  tempStart.value = null; tempEnd.value = null
  hoverDate.value = null; selectionStep.value = 0
}

function toggleCalendar() {
  if (props.disabled) return
  calendarOpen.value = !calendarOpen.value
  if (calendarOpen.value) {
    tempStart.value = startDate.value; tempEnd.value = endDate.value
    selectionStep.value = 0; hoverDate.value = null
    if (startDate.value) {
      leftMonth.value = startDate.value.getMonth()
      leftYear.value = startDate.value.getFullYear()
      if (leftMonth.value === 11) leftMonth.value = 10
    }
  }
}

function selectPreset(mode: FilterType) {
  selectedFilter.value = mode

  if (mode === 'all') {
    startDate.value = null; endDate.value = null
    calendarOpen.value = false
    emit('update:modelValue', { start: null, end: null })
    emit('filter-change', { start: null, end: null })
    return
  }

  if (mode === 'custom') return

  const today = new Date(); today.setHours(0, 0, 0, 0)
  let start = new Date(today)
  const end = new Date(today); end.setHours(23, 59, 59, 999)
  if (mode === 'last7') start.setDate(start.getDate() - 6)
  else if (mode === 'thisMonth') start = new Date(today.getFullYear(), today.getMonth(), 1)

  tempStart.value = start
  tempEnd.value = end
  selectionStep.value = 0

  startDate.value = start; endDate.value = end
  emit('update:modelValue', { start, end })
  emit('filter-change', { start, end })
}

const formatShort = (d: Date) => `${shortMonths[d.getMonth()]} ${d.getDate()}`

const displayText = computed(() => {
  if (selectedFilter.value === 'all') return 'All dates'
  if (!startDate.value) return 'Select range'
  const s = formatShort(startDate.value)
  if (!endDate.value) return s
  const sameDay = startDate.value.toDateString() === endDate.value.toDateString()
  if (sameDay) return startDate.value.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
  const sameYear = startDate.value.getFullYear() === endDate.value.getFullYear()
  const eStr = sameYear ? formatShort(endDate.value) : `${formatShort(endDate.value)}, ${endDate.value.getFullYear()}`
  return `${s} – ${eStr}`
})

function handleOutside(e: MouseEvent) {
  if (pickerRef.value && !pickerRef.value.contains(e.target as Node)) calendarOpen.value = false
}
onMounted(() => document.addEventListener('mousedown', handleOutside))
onBeforeUnmount(() => document.removeEventListener('mousedown', handleOutside))
</script>
