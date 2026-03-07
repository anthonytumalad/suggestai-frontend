<template>
  <div class="flex flex-col space-y-8">

    <!-- Alerts -->
    <BaseAlert
      v-if="saveSuccess"
      severity="success"
      title="Topic summary saved successfully"
      :closable="true"
      @close="saveSuccess = false"
    />

    <BaseAlert
      v-if="summarizeError || isSaving"
      :severity="summarizeError ? 'error' : 'secondary'"
      :title="alertTitle"
      :closable="!!summarizeError"
      @close="clearError"
    />

    <BaseAlert
      v-if="isBulkDeleting"
      severity="secondary"
      title="Deleting suggestions… Please wait"
    />

    <BaseAlert
      v-if="isDeleteSuccess"
      severity="success"
      title="Suggestions deleted successfully"
      :closable="true"
      @close="isDeleteSuccess = false"
    />

    <BaseAlert
      v-if="deleteError"
      severity="error"
      :title="deleteError"
      :closable="true"
      @close="deleteError = null"
    />

    <!-- Main Content -->
    <div class="flex flex-col space-y-4">
      <div class="flex flex-col space-y-10">

        <!-- Summary Card -->
        <SuggestionSummaryCard
          v-if="displaySummary && !isSummarizing"
          :summary="displaySummary"
          :total-suggestions="total"
          :is-saved="showSaved"
          :is-saving="isSaving"
          :duplicate-detected="duplicateDetected"
          :existing-session="existingSession"
          :date-range="dateRangeForDisplay"
          @clear="clearSummary"
          @save="handleSaveWithSuggestion"
        />

        <!-- Filters -->
        <SuggestionFilters
          v-model:dateFilter="dateFilter"
          v-model:search="search"
          v-model:anonymousFilter="anonymousFilter"
          :loading="isSummarizing || isLoading || isFetching"
          :disabled="isSummarizing || isLoading || isFetching || !suggestions.length"
          :selected-count="selectedSuggestions.length"
          :summarizing="isSummarizing"
          @summarize="showConfirmDialog = true"
          @export="handleExport"
          @refresh="refetch"
          @delete-selected="handleDeleteSelected"
          @clear-selection="selectedSuggestions = []"
        />

      </div>

      <!-- Table Card -->
      <div class="bg-bg-primary p-6 rounded border border-border-muted">
        <div class="flex flex-col space-y-4">

          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2 text-sm">
              <span class="text-text-muted">Total suggestions:</span>
              <span class="font-medium text-text-base">{{ total }}</span>
            </div>

            <template v-if="dateFilter.start || dateFilter.end">
              <div class="text-sm text-text-muted">-</div>
              <span class="text-text-muted text-sm">{{ formatDateRangeDisplay }}</span>
            </template>
          </div>

          <SuggestionTable
            :suggestion="suggestions"
            :columns="columns"
            :query="{ isLoading, isFetching }"
            :page="page"
            :perPage="perPage"
            :total="total"
            @update:page="setPage"
            @update:perPage="setPerPage"
            @update:selected="selectedSuggestions = $event"
          />

        </div>
      </div>
    </div>

    <!-- Confirm Summarize Dialog -->
    <BaseDialog v-model="showConfirmDialog" title="Generate Topic Summary" size="lg">
      <div class="space-y-5">
        <div class="space-y-2">
          <p class="text-base text-text-base">
            You are about to generate a topic summary from
            <span class="font-semibold text-primary">
              {{ total }} suggestion{{ total !== 1 ? 's' : '' }}
            </span>.
          </p>
          <p class="text-sm text-text-muted">
            Suggestions will be grouped into common topics to help you
            review recurring suggestions more efficiently.
          </p>
        </div>

        <div
          v-if="dateFilter.start || dateFilter.end"
          class="bg-bg-secondary border border-border-muted rounded p-3 text-sm"
        >
          <p class="font-medium text-text-base mb-1">Included date range</p>
          <p class="text-text-muted">{{ formatDateRange }}</p>
        </div>

        <div class="text-sm text-text-muted">
          <p>Processing may take <span class="font-medium">30–60 seconds</span> depending on the number of suggestions.</p>
          <p>Please keep this page open while the summary is being generated.</p>
        </div>

        <div
          v-if="duplicateDetected"
          class="bg-warning/10 border border-warning rounded p-3 text-sm text-warning"
        >
          A summary already exists for this selection. Continuing may create a new session.
        </div>
      </div>

      <template #footer>
        <BaseButton variant="outline" size="sm" label="Cancel" @click="showConfirmDialog = false" />
        <BaseButton
          variant="primary"
          size="sm"
          :label="duplicateDetected ? 'Generate Again' : 'Generate Summary'"
          :loading="isSummarizing"
          @click="handleConfirmSummarize"
        />
      </template>
    </BaseDialog>

    <!-- Confirm Delete Dialog -->
    <BaseDialog v-model="showDeleteDialog" title="Delete Suggestions" size="sm">
      <p class="text-sm text-text-base">
        Are you sure you want to delete
        <span class="font-semibold text-red-500">{{ selectedSuggestions.length }}</span>
        {{ selectedSuggestions.length === 1 ? 'suggestion' : 'suggestions' }}?
        This cannot be undone.
      </p>

      <template #footer>
        <BaseButton variant="outline" size="sm" label="Cancel" @click="showDeleteDialog = false" />
        <BaseButton
          variant="primary"
          size="sm"
          label="Delete"
          :loading="isBulkDeleting"
          @click="confirmDelete"
        />
      </template>
    </BaseDialog>

  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'

import { formService } from '@/services/forms'
import type { Suggestion } from '@/services/forms'
import { useSuggestions } from '@/composables/forms/useSuggestion'
import { useSuggestionSummary } from '@/composables/forms/useSuggestionSummary'

import SuggestionTable from '@/components/base/table/forms/SuggestionTable.vue'
import SuggestionFilters from '@/components/forms/SuggestionFilters.vue'
import SuggestionSummaryCard from '@/components/base/card/forms/SuggestionSummaryCard.vue'

// --- route ---

const route  = useRoute()
const formId = parseInt(route.params.id as string)

// --- columns ---

const columns = [
  { key: 'id',         label: '#',          sortable: false },
  { key: 'student',    label: 'Student',    sortable: true,  slot: true },
  { key: 'suggestion', label: 'Suggestion', sortable: false },
  { key: 'created_at', label: 'Date',       sortable: true,  slot: true },
]

// --- composables ---

const {
  suggestions,
  total,
  isLoading,
  isFetching,
  page,
  perPage,
  setPage,
  setPerPage,
  setDateRange,
  search,
  setSearch,
  anonymousFilter,
  setAnonymousFilter,
  refetch,
  bulkDeleteSuggestions,
  isBulkDeleting,
} = useSuggestions({ formId })

const {
  displaySummary,
  showSaved,
  duplicateDetected,
  existingSession,
  isSummarizing,
  isSaving,
  summarizeError,
  dateFilter,
  handleSummarize,
  handleSave,
  clearSummary,
  clearError,
  dateRangeForDisplay,
} = useSuggestionSummary(formId)

// --- state ---

const showConfirmDialog   = ref(false)
const showDeleteDialog    = ref(false)
const saveSuccess         = ref(false)
const isDeleteSuccess     = ref(false)
const deleteError         = ref<string | null>(null)
const selectedSuggestions = ref<Suggestion[]>([])

// --- computed ---

const alertTitle = computed(() => {
  if (summarizeError.value) return summarizeError.value
  if (isSummarizing.value)  return `Summarizing ${total.value} suggestions… Please wait`
  if (isSaving.value)       return 'Saving summary…'
  return ''
})

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date)

const formatDateRange = computed(() => {
  const parts: string[] = []
  if (dateFilter.value.start) parts.push(formatDate(dateFilter.value.start))
  if (dateFilter.value.end)   parts.push(formatDate(dateFilter.value.end))
  return parts.join(' to ')
})

const formatDateRangeDisplay = computed(() =>
  (dateFilter.value.start ? `from ${formatDate(dateFilter.value.start)}` : '') +
  (dateFilter.value.end   ? ` to ${formatDate(dateFilter.value.end)}`    : '')
)

// --- watchers ---

watch(dateFilter,      (val) => setDateRange(val))
watch(search,          (val) => setSearch(val))
watch(anonymousFilter, (val) => setAnonymousFilter(val))

// --- handlers ---

const handleSaveWithSuggestion = async (action?: 'keep_both' | 'replace') => {
  await handleSave(action)
  if (!summarizeError.value) {
    saveSuccess.value = true
    clearSummary()
  }
}

const handleConfirmSummarize = async () => {
  showConfirmDialog.value = false
  await handleSummarize()
}

const handleDeleteSelected = () => {
  showDeleteDialog.value = true
}

const confirmDelete = async () => {
  showDeleteDialog.value = false
  try {
    await bulkDeleteSuggestions(selectedSuggestions.value.map(s => s.id))
    selectedSuggestions.value = []
    isDeleteSuccess.value     = true
    setTimeout(() => { isDeleteSuccess.value = false }, 3000)
  } catch {
    deleteError.value = 'Failed to delete suggestions. Please try again.'
  }
}

const handleExport = (type: 'csv' | 'xlsx' | 'pdf') =>
  formService.exportSuggestions(formId, {
    type,
    start_date: dateFilter.value.start?.toISOString().split('T')[0],
    end_date:   dateFilter.value.end?.toISOString().split('T')[0],
  })
</script>
