<template>
  <div class="flex flex-col space-y-4 px-6 py-8">

    <!-- Toolbar -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <BaseSearch
            :modelValue="search"
            placeholder="Search reports..."
            @update:modelValue="search = $event"
          />

          <!-- Status filter -->
          <BaseDropdown align="left" width="auto">
            <template #trigger="{ open }">
              <BaseButton variant="outline" size="sm">
                <IconFilter class="mr-2 h-4 w-4" />
                {{ selectedStatus ?? 'All Status' }}
                <IconChevronDown class="ml-2 h-4 w-4 transition-transform duration-150" :class="{ 'rotate-180': open }" />
              </BaseButton>
            </template>
            <template #default="{ close }">
              <DropdownItem label="All Status"  @click="() => { selectedStatus = null;         close() }" />
              <DropdownItem label="Pending"     @click="() => { selectedStatus = 'pending';    close() }" />
              <DropdownItem label="Processing"  @click="() => { selectedStatus = 'processing'; close() }" />
              <DropdownItem label="Completed"   @click="() => { selectedStatus = 'completed';  close() }" />
              <DropdownItem label="Failed"      @click="() => { selectedStatus = 'failed';     close() }" />
            </template>
          </BaseDropdown>

          <!-- Format filter -->
          <BaseDropdown align="left" width="auto">
            <template #trigger="{ open }">
              <BaseButton variant="outline" size="sm">
                <IconFileDescription class="mr-2 h-4 w-4" />
                {{ selectedFormat ? selectedFormat.toUpperCase() : 'All Formats' }}
                <IconChevronDown class="ml-2 h-4 w-4 transition-transform duration-150" :class="{ 'rotate-180': open }" />
              </BaseButton>
            </template>
            <template #default="{ close }">
              <DropdownItem label="All Formats" @click="() => { selectedFormat = null;   close() }" />
              <DropdownItem label="PDF"         @click="() => { selectedFormat = 'pdf';  close() }" />
              <DropdownItem label="CSV"         @click="() => { selectedFormat = 'csv';  close() }" />
              <DropdownItem label="XLSX"        @click="() => { selectedFormat = 'xlsx'; close() }" />
            </template>
          </BaseDropdown>

          <button
            v-if="hasActiveFilters"
            class="text-xs text-text-muted hover:text-primary transition-colors duration-150 cursor-pointer"
            @click="clearFilters"
          >
            Clear filters
          </button>
        </div>

        <div class="w-px h-5 bg-border-muted shrink-0" />

        <div class="flex items-center gap-2">
          <template v-if="selectedReports.length > 0">
            <span class="text-sm text-text-muted">
              <span class="font-medium text-text-base">{{ selectedReports.length }}</span>
              {{ selectedReports.length === 1 ? 'row' : 'rows' }} selected
            </span>
          </template>

          <BaseButton
            variant="danger"
            size="sm"
            :icon="IconTrash"
            label="Delete"
            :disabled="selectedReports.length === 0 || isBulkDeleting"
            :loading="isBulkDeleting"
            @click="handleBulkDelete"
          />

          <BaseButton
            v-if="selectedReports.length === 1 && selectedReports[0]?.status === 'completed'"
            variant="primary"
            size="sm"
            :icon="IconDownload"
            label="Download"
            :loading="isDownloading"
            @click="handleDownload(selectedReports[0]!)"
          />
        </div>
      </div>

      <BaseButton
        variant="outline"
        :icon="IconRefresh"
        size="sm"
        @click="refetch()"
      />
    </div>

    <!-- Table -->
    <div class="bg-bg-primary p-6 rounded border border-border-muted">
      <BaseTable
        :columns="columns"
        :items="reports"
        :query="{ isLoading, isFetching }"
        :page="page"
        :per-page="perPage"
        :total="total"
        :selectable="true"
        @update:page="page = $event"
        @update:per-page="perPage = $event"
        @update:selected="selectedReports = $event"
      >
        <template #cell-status="{ item }">
          <span
            class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
            :class="statusClass(item.status)"
          >
            <span class="h-1.5 w-1.5 rounded-full" :class="statusDotClass(item.status)" />
            {{ item.status }}
          </span>
        </template>

        <template #cell-format="{ item }">
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-medium bg-bg-muted text-text-muted uppercase">
            {{ item.format }}
          </span>
        </template>

        <template #cell-file_size="{ item }">
          <span class="text-text-muted text-sm">
            {{ item.file_size_formatted ?? '—' }}
          </span>
        </template>

        <template #cell-created_at="{ item }">
          <span class="text-text-muted text-sm">{{ formatDate(item.created_at) }}</span>
        </template>
      </BaseTable>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  IconTrash, IconDownload, IconFilter,
  IconFileDescription, IconChevronDown, IconRefresh,
} from '@tabler/icons-vue'
import BaseTable, { type Column } from '@/components/base/table/BaseTable.vue'
import { useReports } from '@/composables/reports/useReport'
import type { Report } from '@/services/reports'

// ── Filters ────────────────────────────────────────────────────────────────
const page           = ref(1)
const perPage        = ref(15)
const search         = ref<string | undefined>(undefined)
const selectedStatus = ref<string | null>(null)
const selectedFormat = ref<string | null>(null)

const hasActiveFilters = computed(() =>
  !!(selectedStatus.value || selectedFormat.value || search.value)
)

const clearFilters = () => {
  selectedStatus.value = null
  selectedFormat.value = null
  search.value         = undefined
  page.value           = 1
}

// ── Composable ─────────────────────────────────────────────────────────────
const {
  reports,
  total,
  isLoading,
  isFetching,
  bulkDeleteReports,
  isBulkDeleting,
  downloadReport,
  isDownloading,
  refetch
} = useReports({
  page,
  per_page: perPage,
  search,
  status: computed(() => selectedStatus.value ?? undefined),
  format: computed(() => selectedFormat.value ?? undefined),
})

// ── Selection ──────────────────────────────────────────────────────────────
const selectedReports = ref<Report[]>([])

// ── Columns ────────────────────────────────────────────────────────────────
const columns: Column<Report>[] = [
  { key: 'id',         label: '#',       sortable: false },
  { key: 'title',      label: 'Title',   sortable: false },
  { key: 'format',     label: 'Format',  sortable: false, slot: true },
  { key: 'status',     label: 'Status',  sortable: false, slot: true },
  { key: 'file_size',  label: 'Size',    sortable: false, slot: true },
  { key: 'created_at', label: 'Created', sortable: true,  slot: true },
]


const handleBulkDelete = async () => {
  await bulkDeleteReports(selectedReports.value.map(r => r.id))
  selectedReports.value = []
}

const handleDownload = async (report: Report) => {
  await downloadReport({ reportId: report.id, title: report.title, format: report.format })
}

// ── Helpers ────────────────────────────────────────────────────────────────
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const statusClass = (status: Report['status']) => ({
  'bg-yellow-50 text-yellow-700': status === 'pending',
  'bg-blue-50 text-blue-700':     status === 'processing',
  'bg-green-50 text-green-700':   status === 'completed',
  'bg-red-50 text-red-700':       status === 'failed',
})

const statusDotClass = (status: Report['status']) => ({
  'bg-yellow-400': status === 'pending',
  'bg-blue-400':   status === 'processing',
  'bg-green-400':  status === 'completed',
  'bg-red-400':    status === 'failed',
})
</script>
