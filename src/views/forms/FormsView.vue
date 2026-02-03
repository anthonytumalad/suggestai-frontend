<template>
  <div>
     <BaseAlert
      v-if="isError"
      severity="error"
      :closable="true"
      message="getErrorMessage(error)"
      class="mb-4"
    />
    <div
      class="bg-bg-primary p-6 rounded"
    >
      <FormsTable
        :forms="forms"
        :columns="columns"
        :loading="isLoading"
        :query="{ isLoading, isFetching }"
        :page="page"
        :per-page="perPage"
        :total="total"
        @page-change="setPage"
        @per-page-change="setPerPage"
        @row-click="handleRowClick"
      >
        <template #is_active="{ value }">
          <span>{{ value ? 'Active' : 'Not Active' }}</span>
        </template>
      </FormsTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useForms } from '@/composables/forms/useForm'
import type { FormItems } from '@/components/base/table/forms/FormsTable.vue'
import FormsTable from '@/components/base/table/forms/FormsTable.vue'

const router = useRouter()

const columns = [
  { key: 'id', label: '#', sortable: false },
  { key: 'title', label: 'Name', sortable: true, slot: true },
  { key: 'suggestions_count', label: 'Total Suggestions', sortable: true },
  { key: 'is_active', label: 'Active', sortable: false, slot: true },
]

const {
  forms,
  total,
  isLoading,
  isError,
  isFetching,
  page,
  perPage,
  setPage,
  setPerPage,
} = useForms({
  page: 1,
  per_page: 15
})

const handleRowClick = (form: FormItems) => {
  router.push({
    name: 'formSuggestions',
    params: { id: form.id },
    query: { title: form.title }
  })
}
</script>
