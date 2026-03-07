<template>
  <div class="flex items-center justify-between">

    <!-- Selection action bar -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
      mode="out-in"
    >
      <div v-if="selectedCount > 0" class="flex items-center gap-3">
        <span class="text-sm text-text-muted">
          <span class="font-medium text-text-base">{{ selectedCount }}</span>
          {{ selectedCount === 1 ? 'row' : 'rows' }} selected
        </span>
        <div class="w-px h-5 bg-border-muted shrink-0" />
        <BaseButton
          variant="danger"
          size="sm"
          :icon="IconTrash"
          label="Delete"
          @click="$emit('delete-selected')"
        />
      </div>

      <!-- Normal filters -->
      <div v-else class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <BaseSearch
            :modelValue="search"
            placeholder="Search suggestions..."
            @update:modelValue="$emit('update:search', $event)"
          />
          <BaseDatePicker
            :modelValue="dateFilter"
            :disabled="loading"
            @update:modelValue="!loading && $emit('update:dateFilter', $event)"
          />
          <BaseDropdown align="left" width="auto" :disabled="loading">
            <template #trigger="{ open }">
              <BaseButton variant="outline" size="sm" :disabled="loading">
                <IconUserQuestion class="mr-2 h-4 w-4" />
                {{ currentAnonymousLabel }}
                <IconChevronDown class="ml-2 h-4 w-4 transition-transform duration-150" :class="{ 'rotate-180': open }" />
              </BaseButton>
            </template>
            <template #default="{ close }">
              <DropdownItem
                v-for="opt in anonymousOptions"
                :key="opt.value"
                :label="opt.label"
                @click="() => { $emit('update:anonymousFilter', opt.value); close() }"
              />
            </template>
          </BaseDropdown>
        </div>

        <div class="w-px h-5 bg-border-muted shrink-0" />

        <div class="flex items-center gap-2">
          <BaseDropdown align="left" width="md" :disabled="loading">
            <template #trigger="{ open }">
              <BaseButton variant="outline" size="sm" :disabled="loading">
                <IconDownload class="mr-2 h-4 w-4" />
                Export
                <IconChevronDown class="ml-2 h-4 w-4 transition-transform duration-150" :class="{ 'rotate-180': open }" />
              </BaseButton>
            </template>
            <template #default="{ close }">
              <DropdownItem label="Export as CSV"   :icon="IconFileTypeCsv"    @click="() => { handleExport('csv');  close() }" />
              <DropdownItem label="Export as Excel" :icon="IconFileSpreadsheet" @click="() => { handleExport('xlsx'); close() }" />
              <DropdownItem label="Export as PDF"   :icon="IconFileTypePdf"    @click="() => { handleExport('pdf');  close() }" />
            </template>
          </BaseDropdown>

          <BaseButton
            variant="primary"
            :icon="IconSparkles2"
            size="sm"
            label="Summarize"
            :disabled="disabled"
            :loading="summarizing"
            @click="$emit('summarize')"
          />
        </div>
      </div>
    </Transition>

    <BaseButton
      variant="outline"
      :icon="IconRefresh"
      size="sm"
      :disabled="loading"
      @click="$emit('refresh')"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  IconSparkles2, IconRefresh, IconDownload, IconChevronDown,
  IconFileTypeCsv, IconFileSpreadsheet, IconFileTypePdf,
  IconUserQuestion, IconTrash
} from '@tabler/icons-vue'

export type AnonymousFilter = 'all' | 'anonymous' | 'identified'

const props = defineProps<{
  dateFilter:      { start: Date | null; end: Date | null }
  search:          string
  loading:         boolean
  disabled:        boolean
  anonymousFilter: AnonymousFilter
  selectedCount:   number
  summarizing:     boolean
}>()

const emit = defineEmits<{
  'update:dateFilter':      [value: { start: Date | null; end: Date | null }]
  'update:search':          [value: string]
  'update:anonymousFilter': [value: AnonymousFilter]
  summarize:                []
  export:                   [type: 'csv' | 'xlsx' | 'pdf']
  refresh:                  []
  'delete-selected':        []
  'clear-selection':        []
}>()

const anonymousOptions: { label: string; value: AnonymousFilter }[] = [
  { label: 'All',       value: 'all'        },
  { label: 'Named',     value: 'identified' },
  { label: 'Anonymous', value: 'anonymous'  },
]

const currentAnonymousLabel = computed(() =>
  anonymousOptions.find(o => o.value === props.anonymousFilter)?.label ?? 'All'
)

const handleExport = (type: 'csv' | 'xlsx' | 'pdf') => emit('export', type)
</script>
