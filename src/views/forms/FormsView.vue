<template>
  <div class="px-6 py-8">
    <div class="flex flex-col space-y-8">
      <BaseAlert
        v-if="isError"
        severity="error"
        :closable="true"
        message="Failed to load forms"
        class="mb-4"
      />

      <div class="flex flex-col space-y-4">

        <!-- Toolbar -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Transition
              mode="out-in"
              enter-active-class="transition-all duration-200 ease-out"
              enter-from-class="opacity-0 -translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition-all duration-150 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-1"
            >
              <div v-if="selectedForms.length === 0" class="flex items-center gap-2">
                <BaseButton variant="primary" :icon="IconPlus" size="sm" label="Add" @click="openModal" />
              </div>
              <div v-else class="flex items-center gap-3">
                <span class="text-sm text-text-muted">
                  <span class="font-medium text-text-base">{{ selectedForms.length }}</span>
                  {{ selectedForms.length === 1 ? 'row' : 'rows' }} selected
                </span>
                <div class="w-px h-5 bg-border-muted shrink-0" />
                <BaseButton
                  variant="outline"
                  :icon="IconTrash"
                  size="sm"
                  label="Delete"
                  class="hover:text-red-500"
                  @click="handleDeleteSelected"
                />
              </div>
            </Transition>
          </div>

          <!-- Filters -->
          <div class="flex items-center gap-2">
            <BaseSearch
              :modelValue="search"
              placeholder="Search forms..."
              @update:modelValue="search = $event"
            />

            <BaseDropdown align="right" width="auto">
              <template #trigger="{ open }">
                <BaseButton variant="outline" size="sm">
                  <IconFilter class="mr-2 h-4 w-4" />
                  {{ statusLabels[statusFilter] }}
                  <IconChevronDown class="ml-2 h-4 w-4 transition-transform duration-150" :class="{ 'rotate-180': open }" />
                </BaseButton>
              </template>
              <template #default="{ close }">
                <DropdownItem label="All Status" @click="() => { statusFilter = 'all';      close() }" />
                <DropdownItem label="Active"     @click="() => { statusFilter = 'active';   close() }" />
                <DropdownItem label="Inactive"   @click="() => { statusFilter = 'inactive'; close() }" />
              </template>
            </BaseDropdown>

            <BaseDropdown align="right" width="auto">
              <template #trigger="{ open }">
                <BaseButton variant="outline" size="sm">
                  <IconArrowsSort class="mr-2 h-4 w-4" />
                  {{ sortLabels[sortOption] }}
                  <IconChevronDown class="ml-2 h-4 w-4 transition-transform duration-150" :class="{ 'rotate-180': open }" />
                </BaseButton>
              </template>
              <template #default="{ close }">
                <DropdownItem label="Newest"           @click="() => { sortOption = 'newest';           close() }" />
                <DropdownItem label="Oldest"           @click="() => { sortOption = 'oldest';           close() }" />
                <DropdownItem label="Most Suggestions" @click="() => { sortOption = 'most_suggestions'; close() }" />
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
        </div>

        <div class="bg-bg-primary p-6 rounded border border-border-muted">
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
            @update:selected="selectedForms = $event"
          >
            <template #is_active="{ value }">
              <span>{{ value ? 'Active' : 'Not Active' }}</span>
            </template>
          </FormsTable>
        </div>
      </div>
    </div>

    <!-- Add Form Dialog -->
    <BaseDialog
      v-model="isModalOpen"
      title="Add Form"
      size="md"
      :show-close="true"
      :close-on-backdrop="true"
      :close-on-escape="true"
      @close="resetForm"
    >
      <form class="flex flex-col space-y-5" @submit.prevent="handleSave">
        <div class="flex flex-col space-y-1.5">
          <label class="text-sm text-text-base">
            Name <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            placeholder="Enter form name"
            class="w-full px-3 py-2 text-sm rounded border border-border-muted bg-bg-primary text-text-base placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors duration-150"
            :class="{ 'border-red-400': errors.name }"
          />
          <span v-if="errors.name" class="text-xs text-red-500">{{ errors.name }}</span>
        </div>

        <div class="flex flex-col space-y-1.5">
          <label class="text-sm text-text-base">
            Description <span class="text-text-muted text-xs">(optional)</span>
          </label>
          <textarea
            v-model="form.description"
            placeholder="Enter a description"
            rows="3"
            class="w-full px-3 py-2 text-sm rounded border border-border-muted bg-bg-primary text-text-base placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors duration-150 resize-none"
          />
        </div>

        <div class="flex items-center justify-between py-1">
          <div class="flex flex-col space-y-0.5">
            <span class="text-sm text-text-base">Status</span>
            <span class="text-xs text-text-muted">
              {{ form.is_active ? 'This form is active' : 'This form is inactive' }}
            </span>
          </div>
          <button
            type="button"
            role="switch"
            :aria-checked="form.is_active"
            class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none"
            :class="form.is_active ? 'bg-primary' : 'bg-border-muted'"
            @click="form.is_active = !form.is_active"
          >
            <span
              class="pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-200"
              :class="form.is_active ? 'translate-x-4' : 'translate-x-0'"
            />
          </button>
        </div>
      </form>

      <template #footer>
        <BaseButton variant="outline" size="sm" label="Cancel" @click="isModalOpen = false; resetForm()" />
        <BaseButton variant="primary" size="sm" label="Add Form" @click="handleSave" />
      </template>
    </BaseDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { IconPlus, IconTrash, IconFilter, IconChevronDown, IconArrowsSort } from '@tabler/icons-vue'

import { useForms, type FormItem } from '@/composables/forms/useForm'
import FormsTable from '@/components/base/table/forms/FormsTable.vue'

const router = useRouter()

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
  search,
  statusFilter,
  sortOption,
  hasActiveFilters,
  clearFilters,
} = useForms({ page: 1, perPage: 15 })

const statusLabels = {
  all:      'All Status',
  active:   'Active',
  inactive: 'Inactive',
}

const sortLabels = {
  newest:           'Newest',
  oldest:           'Oldest',
  most_suggestions: 'Most Suggestions',
}

const columns = [
  { key: 'id',                label: '#',                sortable: false },
  { key: 'title',             label: 'Name',             sortable: true, slot: true },
  { key: 'suggestions_count', label: 'Total Suggestions', sortable: true },
  { key: 'is_active',         label: 'Active',           sortable: false, slot: true },
]

const isModalOpen   = ref(false)
const selectedForms = ref<FormItem[]>([])

const form   = reactive({ name: '', description: '', is_active: true })
const errors = reactive({ name: '' })

const openModal = () => router.push({ name: 'addForm' })

const resetForm = () => {
  form.name        = ''
  form.description = ''
  form.is_active   = true
  errors.name      = ''
}

const validate = (): boolean => {
  errors.name = form.name.trim() ? '' : 'Name is required.'
  return !errors.name
}

const handleRowClick = (f: FormItem) => {
  router.push({
    name:   'formOverview',
    params: { id: f.id },
    query:  { title: f.title },
  })
}

const handleSave = () => {
  if (!validate()) return
  isModalOpen.value = false
  resetForm()
}

const handleDeleteSelected = async () => {
  console.log('delete:', selectedForms.value.map(f => f.id))
  selectedForms.value = []
}
</script>
