<template>
  <div class="flex flex-col space-y-4">

    <BaseAlert
      v-if="summarizeError"
      severity="error"
      title="Analysis Failed"
      :message="summarizeError"
      @close="clearError"
    />

    <SuggestionPageHeader
      :title="formTitle"
      :form-url="formUrl"
      :qr-code-url="qrCodeUrl"
      @download="handleDownload"
      @edit="handleEdit"
      @delete="handleDelete"
    />

    <SuggestionFilters
      v-model:dateFilter="dateFilter"
      :disabled="isSummarizing || !suggestions.length"
      @summarize="showConfirmDialog = true"
    />

    <!-- Analyzing in progress -->
    <BaseAlert
      v-if="isSummarizing"
      severity="secondary"
      :title="`Analyzing ${total} suggestions... Please wait`"
      :closable="false"
    />

    <!-- Saving in progress -->
    <BaseAlert
      v-if="isSaving"
      severity="secondary"
      title="Saving topic session..."
      :closable="false"
    />

    <!-- Summary card — shown after analyze, updated after save -->
    <SuggestionSummaryCard
      v-if="displaySummary && !isSummarizing"
      :summary="displaySummary"
      :total-suggestions="total"
      :is-saved="showSaved"
      :is-saving="isSaving"
      :duplicate-detected="duplicateDetected"
      :existing-session="existingSession"
      @clear="clearSummary"
      @save="handleSave"
    />

    <!-- Suggestions table -->
    <div class="bg-bg-primary p-6 rounded border border-border-muted">
      <div class="flex flex-col space-y-4">
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2 text-sm">
            <span class="text-text-muted">Total suggestions:</span>
            <span class="font-medium text-text-base">{{ total }}</span>
          </div>
          <span v-if="dateFilter.start || dateFilter.end" class="text-text-muted text-sm">
            - {{ formatDateRangeDisplay() }}
          </span>
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
        />
      </div>
    </div>

    <!-- Confirm analyze dialog -->
    <BaseDialog v-model="showConfirmDialog" title="Confirm Analysis" size="lg">
      <div class="space-y-4">
        <p class="text-base text-text-base">
          Analyze
          <span class="font-semibold">{{ total }} suggestions</span>
          for topics?
        </p>
        <p v-if="dateFilter.start || dateFilter.end" class="text-sm text-text-muted">
          {{ formatDateRange() }}
        </p>
        <p class="text-sm text-text-muted">
          This may take 30–60 seconds depending on the number of suggestions.
        </p>
      </div>

      <template #footer>
        <BaseButton
          variant="outline"
          size="sm"
          label="Cancel"
          @click="showConfirmDialog = false"
        />
        <BaseButton
          variant="primary"
          size="sm"
          label="Yes, analyze"
          :loading="isSummarizing"
          @click="handleConfirmSummarize"
        />
      </template>
    </BaseDialog>

  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSuggestions } from '@/composables/forms/useSuggestion'
import { useFormDetails } from '@/composables/forms/useFormDetails'
import { useSuggestionSummary } from '@/composables/forms/useSuggestionSummary'
import SuggestionTable from '@/components/base/table/forms/SuggestionTable.vue'
import SuggestionPageHeader from '@/components/forms/SuggestionPageHeader.vue'
import SuggestionFilters from '@/components/forms/SuggestionFilters.vue'
import SuggestionSummaryCard from '@/components/base/card/forms/SuggestionSummaryCard.vue'

const route  = useRoute()
const formId = parseInt(route.params.id as string)

const { form } = useFormDetails(formId)
const formTitle = ref<string>(route.query.title as string)

const columns = [
  { key: 'id',         label: '#',          sortable: false },
  { key: 'student',    label: 'Student',    slot: true, sortable: true },
  { key: 'suggestion', label: 'Suggestion', sortable: false },
  { key: 'created_at', label: 'Date',       sortable: true, slot: true },
]

const {
  suggestions, total, isLoading, isFetching,
  page, perPage, setPage, setPerPage, setDateRange,
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
  handleDateChange,
} = useSuggestionSummary(formId)

const showConfirmDialog = ref(false)

watch(dateFilter, (value) => {
  setDateRange(value)
  handleDateChange(value)
})

const handleConfirmSummarize = async () => {
  showConfirmDialog.value = false
  await handleSummarize()
}

const handleDownload = () => {}
const handleEdit     = () => {}
const handleDelete   = () => {}

const formUrl = computed(() => {
  if (!form.value?.slug) return ''
  return `${window.location.origin}/forms/${form.value.slug}`
})

const qrCodeUrl = computed(() => {
  if (!form.value?.slug) return ''
  const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '')
  return `${baseUrl}/forms/${form.value.slug}/qrcode`
})

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date)

const formatDateRange = () => {
  const parts: string[] = []
  if (dateFilter.value.start) parts.push(formatDate(dateFilter.value.start))
  if (dateFilter.value.end)   parts.push(formatDate(dateFilter.value.end))
  return parts.join(' to ')
}

const formatDateRangeDisplay = () =>
  (dateFilter.value.start ? `from ${formatDate(dateFilter.value.start)}` : '') +
  (dateFilter.value.end   ? ` to ${formatDate(dateFilter.value.end)}`   : '')
</script>
