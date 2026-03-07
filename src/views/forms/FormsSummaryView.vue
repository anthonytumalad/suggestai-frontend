<template>
  <div class="flex flex-col space-y-8">
    <BaseAlert
      v-if="isError"
      severity="error"
      title="Failed to load sessions"
      :message="sessionError?.message ?? 'An unexpected error occurred.'"
      :closable="false"
    />
    <BaseAlert
      v-if="reportSuccess"
      severity="success"
      title="Report queued"
      message="Your report is being generated and will be available shortly."
      @close="reportSuccess = false"
    />
    <BaseAlert
      v-if="reportError"
      severity="error"
      title="Failed to generate report"
      :message="reportError"
      @close="reportError = null"
    />
    <div class="flex flex-col space-y-4">

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">

          <div class="flex items-center gap-2">
            <BaseSearch
              placeholder="Search sessions..."
              @update:modelValue="search = $event"
            />

            <BaseDropdown align="left" width="auto">
              <template #trigger="{ open }">
                <BaseButton variant="outline" size="sm">
                  <IconFilter class="mr-2 h-4 w-4" />
                  {{ selectedStatus ?? 'All Status' }}
                  <IconChevronDown
                    class="ml-2 h-4 w-4 transition-transform duration-150"
                    :class="{ 'rotate-180': open }"
                  />
                </BaseButton>
              </template>
              <template #default="{ close }">
                <DropdownItem label="All Status" @click="() => { selectedStatus = null; close() }" />
                <DropdownItem label="Completed" @click="() => { selectedStatus = 'completed'; close() }" />
                <DropdownItem label="Pending" @click="() => { selectedStatus = 'pending'; close() }" />
                <DropdownItem label="Failed" @click="() => { selectedStatus = 'failed'; close() }" />
              </template>
            </BaseDropdown>

            <BaseDropdown align="left" width="auto">
              <template #trigger="{ open }">
                <BaseButton variant="outline" size="sm">
                  <IconTopologyStar class="mr-2 h-4 w-4" />
                  {{ selectedTopics ?? 'Any Topics' }}
                  <IconChevronDown
                    class="ml-2 h-4 w-4 transition-transform duration-150"
                    :class="{ 'rotate-180': open }"
                  />
                </BaseButton>
              </template>
              <template #default="{ close }">
                <DropdownItem label="Any Topics" @click="() => { selectedTopics = null; close() }" />
                <DropdownItem label="1–5 topics" @click="() => { selectedTopics = '1-5'; close() }" />
                <DropdownItem label="6–15 topics" @click="() => { selectedTopics = '6-15'; close() }" />
                <DropdownItem label="15+ topics" @click="() => { selectedTopics = '15+'; close() }" />
              </template>
            </BaseDropdown>

            <BaseDropdown align="left" width="auto">
              <template #trigger="{ open }">
                <BaseButton variant="outline" size="sm">
                  <IconArrowsSort class="mr-2 h-4 w-4" />
                  {{ selectedSort ?? 'Sort by' }}
                  <IconChevronDown
                    class="ml-2 h-4 w-4 transition-transform duration-150"
                    :class="{ 'rotate-180': open }"
                  />
                </BaseButton>
              </template>
              <template #default="{ close }">
                <DropdownItem label="Newest first" @click="() => { selectedSort = 'newest'; close() }" />
                <DropdownItem label="Oldest first" @click="() => { selectedSort = 'oldest'; close() }" />
                <DropdownItem label="Most topics" @click="() => { selectedSort = 'topics_desc'; close() }" />
                <DropdownItem label="Most suggestions" @click="() => { selectedSort = 'suggestions_desc'; close() }" />
                <DropdownItem label="Most outliers" @click="() => { selectedSort = 'outliers_desc'; close() }" />
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
            <template v-if="selectedCount > 0">
              <span class="text-sm text-text-muted">
                <span class="font-medium text-text-base">{{ selectedCount }}</span>
                {{ selectedCount === 1 ? 'row' : 'rows' }} selected
              </span>
            </template>
            <BaseButton
              variant="danger"
              size="sm"
              :icon="IconTrash"
              label="Delete"
              :disabled="selectedCount === 0"
            />
            <BaseDropdown align="left" width="auto">
              <template #trigger="{ open }">
                <BaseButton
                  variant="primary"
                  size="sm"
                  :icon="IconReportAnalytics"
                  :disabled="selectedCount !== 1 || isCreating"
                  :loading="isCreating"
                >
                  Generate Report
                  <IconChevronDown class="ml-2 h-4 w-4 transition-transform duration-150" :class="{ 'rotate-180': open }" />
                </BaseButton>
              </template>
              <template #default="{ close }">
                <DropdownItem
                  label="Export as PDF"
                  :icon="IconFileTypePdf"
                  @click="() => { handleGenerateReport('pdf');  close() }"
                />
                <DropdownItem
                  label="Export as CSV"
                  :icon="IconFileTypeCsv"
                  @click="() => { handleGenerateReport('csv');  close() }"
                />
                <DropdownItem
                  label="Export as Excel"
                  :icon="IconFileSpreadsheet"
                  @click="() => { handleGenerateReport('xlsx'); close() }"
                />
              </template>
            </BaseDropdown>
          </div>

        </div>
        <BaseButton
          variant="outline"
          :icon="IconRefresh"
          size="sm"
          @click="$emit('refresh')"
        />
      </div>

      <div class="bg-bg-primary p-6 rounded border border-border-muted">
        <TopicSessionTable
          :sessions="paginatedSessions"
          :columns="columns"
          :query="{ isLoading, isFetching }"
          :page="page"
          :per-page="perPage"
          :total="total"
          @update:page="page = $event"
          @update:per-page="perPage = $event"
          @row-click="handleRowClick"
          @update:selected="selectedSessions = $event"
        />
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  IconTrash, IconReportAnalytics, IconChevronDown,
  IconArrowsSort, IconFilter, IconTopologyStar, IconRefresh,
  IconFileTypePdf, IconFileTypeCsv, IconFileSpreadsheet,
} from '@tabler/icons-vue'
import { useReports } from '@/composables/reports/useReport'
import TopicSessionTable, { type SessionItem } from '@/components/base/table/forms/TopicSessionTable.vue'
import type { Column } from '@/components/base/table/BaseTable.vue'
import { useTopicSessions, type SortOption, type TopicsRange } from '@/composables/forms/useTopicSessions'

const route = useRoute()
const router = useRouter()

const formId = parseInt(route.params.id as string)
const page = ref(1)
const perPage = ref(15)
const search = ref('')

const selectedStatus = ref<string | null>(null)
const selectedTopics = ref<TopicsRange | null>(null)
const selectedSort   = ref<SortOption | null>(null)
const selectedSessions = ref<SessionItem[]>([])
const selectedCount = computed(() => selectedSessions.value.length)
const selectedSession = computed(() => selectedSessions.value[0] ?? null)

const reportSuccess = ref(false)
const reportError   = ref<string | null>(null)

watch([search, selectedStatus, selectedTopics, selectedSort], () => {
  page.value = 1
})

const hasActiveFilters = computed(() =>
  !!(selectedStatus.value || selectedTopics.value || selectedSort.value)
)

const clearFilters = () => {
  selectedStatus.value = null
  selectedTopics.value = null
  selectedSort.value = null
}

const {
  paginatedSessions,
  total,
  isLoading,
  isFetching,
  isError,
  sessionError,
} = useTopicSessions({
  formId,
  page,
  perPage,
  search,
  selectedStatus,
  selectedTopics,
  selectedSort
})

const { createReport, isCreating } = useReports()

const columns: Column<SessionItem>[] = [
  { key: 'id', label: '#', sortable: false },
  { key: 'name', label: 'Name', sortable: false },
  { key: 'date_range', label: 'Date Range', slot: true, sortable: false },
  { key: 'total_topics', label: 'Topics', sortable: false },
  { key: 'total_documents', label: 'Suggestions', sortable: false },
  { key: 'outliers', label: 'Outliers', sortable: false },
  { key: 'status', label: 'Status', slot: true, sortable: false },
  { key: 'created_at', label: 'Created', slot: true, sortable: true }
]

const handleRowClick = (session: SessionItem) => {
  router.push({
    name: 'formOverview',
    params: { id: formId },
    query: { sessionId: String(session.id) },
  })
}

const handleGenerateReport = async (format: 'pdf' | 'csv' | 'xlsx') => {
  if (!selectedSession.value) return

  reportSuccess.value = false
  reportError.value   = null

  try {
    await createReport({
      topic_session_id: selectedSession.value.id,
      format,
    })
    reportSuccess.value = true
  } catch (err) {
    reportError.value = err instanceof Error
      ? err.message
      : 'Something went wrong.'
  }
}
</script>

