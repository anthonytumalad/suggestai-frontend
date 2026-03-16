<template>
  <div>
    <!-- Form Header -->
    <div class="flex items-center gap-6 px-6 pt-6 pb-4">
      <h1 class="text-3xl font-medium text-text-base">
        {{ formTitle || '...' }}
      </h1>
      <div class="flex items-center gap-3">
        <button
          class="flex items-center gap-1.5 text-sm py-1.5 text-text-muted hover:text-primary transition-colors duration-300 cursor-pointer"
          @click="editDialog = true"
        >
          <IconPencil class="w-4 h-4" />
          Edit
        </button>
        <button
          class="flex items-center gap-1.5 text-sm py-1.5 text-text-muted hover:text-primary transition-colors duration-300 cursor-pointer"
          @click="handleShow"
        >
          <IconExternalLink class="w-4 h-4" />
          Show
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex border-b border-border-muted px-2">
      <button
        v-for="tab in tabs"
        :key="tab.name"
        @click="selectTab(tab.name)"
        class="cursor-pointer px-4 py-2 text-sm border-b-2 transition"
        :class="isActive(tab.name)
          ? 'border-primary text-primary font-medium'
          : 'border-transparent text-text-muted hover:text-text-base hover:border-border-muted'"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab Content -->
    <div class="py-8 px-6 mx-auto">
      <router-view />
    </div>

    <!-- Edit Dialog -->
    <BaseDialog
      v-model="editDialog"
      title="Edit Form"
      size="xl"
      @close="resetEdit"
    >
      <div class="flex flex-col space-y-4">

        <!-- Image Upload -->
        <div
          class="relative w-full h-34 rounded border-2 border-dashed border-border-muted bg-white overflow-hidden cursor-pointer group"
          @click="triggerFileInput"
          @dragover.prevent
          @drop.prevent="handleDrop"
        >
          <img v-if="imagePreview" :src="imagePreview" alt="Cover preview" class="w-full h-full object-cover" />
          <div
            v-else
            class="absolute inset-0 flex flex-col items-center justify-center space-y-2 text-text-muted group-hover:text-primary transition-colors duration-200"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span class="text-sm">Click or drag to upload cover image</span>
            <span class="text-xs">PNG, JPG up to 5MB</span>
          </div>
          <button
            v-if="imagePreview"
            type="button"
            class="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors duration-150"
            @click.stop="removeImage"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileChange" />
        </div>

        <!-- Name -->
        <div class="flex flex-col space-y-1.5">
          <BaseInput
            v-model="editForm.name"
            placeholder="Enter form name"
            size="sm"
            :inputClass="editErrors.name ? 'border-red-400' : ''"
            @input="editErrors.name = ''"
          />
          <span v-if="editErrors.name" class="text-xs text-red-500">{{ editErrors.name }}</span>
        </div>

        <!-- Description -->
        <div class="flex flex-col space-y-1.5">
          <label class="text-sm text-text-base">
            Description <span class="text-text-muted text-xs">(optional)</span>
          </label>
          <BaseTextarea
            v-model="editForm.description"
            placeholder="Enter a description"
            size="sm"
            :rows="3"
          />
        </div>

        <!-- Divider -->
        <div class="border-t border-gray-100" />

        <!-- Status Toggle -->
        <div class="flex items-center justify-between">
          <div class="flex flex-col space-y-0.5">
            <span class="text-sm text-text-base">Status</span>
            <span class="text-xs text-text-muted">
              {{ editForm.is_active ? 'This form is active' : 'This form is inactive' }}
            </span>
          </div>
          <button
            type="button"
            role="switch"
            :aria-checked="editForm.is_active"
            class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none"
            :class="editForm.is_active ? 'bg-primary' : 'bg-border-muted'"
            @click="editForm.is_active = !editForm.is_active"
          >
            <span
              class="pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-200"
              :class="editForm.is_active ? 'translate-x-4' : 'translate-x-0'"
            />
          </button>
        </div>

        <!-- Alert -->
        <BaseAlert
          v-if="editAlertMessage"
          :severity="editAlertSeverity"
          :message="editAlertMessage"
          :closable="true"
          @close="editAlertMessage = null"
        />

      </div>

      <template #footer>
        <button
          type="button"
          class="text-sm cursor-pointer hover:underline text-text-muted"
          @click="editDialog = false"
        >
          Cancel
        </button>
        <BaseButton
          variant="primary"
          label="Save changes"
          size="sm"
          :loading="isUpdating || isLoadingEdit"
          @click="handleSaveEdit"
        />
      </template>
    </BaseDialog>

    <!-- Show Dialog -->
    <BaseDialog
      v-model="showDialog"
      title="Form Link & QR Code"
      size="sm"
    >
      <div class="flex flex-col items-center space-y-5">

        <div class="flex items-center justify-center w-44 h-44 bg-gray-50 rounded border border-border-muted overflow-hidden">
          <div v-if="isLoadingShow" class="text-xs text-text-muted">Loading...</div>
          <img v-else-if="qrCodeUrl" :src="qrCodeUrl" alt="QR Code" class="w-full h-full object-contain p-2" />
        </div>

        <div class="w-full">
          <p class="text-xs text-text-muted mb-1.5">Public link</p>
          <div class="flex items-center gap-2 bg-gray-50 border border-border-muted rounded px-3 py-2">
            <span class="flex-1 text-sm text-text-base truncate">{{ formUrl || '...' }}</span>
            <button
              type="button"
              class="shrink-0 text-text-muted hover:text-primary transition-colors duration-200 cursor-pointer"
              @click="copyLink"
            >
              <IconCheck v-if="copied" class="w-4 h-4 text-green-500" />
              <IconCopy v-else class="w-4 h-4" />
            </button>
            <a
              :href="formUrl ?? undefined"
              target="_blank"
              rel="noopener noreferrer"
              class="shrink-0 text-text-muted hover:text-primary transition-colors duration-200"
            >
              <IconExternalLink class="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </BaseDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { IconPencil, IconExternalLink, IconCopy, IconCheck } from '@tabler/icons-vue'
import { formService } from '@/services/forms'
import { useForms } from '@/composables/forms/useForm'

const route = useRoute()
const router = useRouter()

const formId    = route.params.id
const formTitle = route.query.title


const tabs = [
  { label: 'Overview',    name: 'formOverview' },
  { label: 'Suggestions', name: 'formSuggestions' },
  { label: 'Summary',     name: 'formSummary' },
]

const selectTab = (tabName: string) => {
  if (route.name !== tabName)
    router.push({ name: tabName, params: { id: formId }, query: { title: formTitle } })
}

const isActive = (tabName: string) => route.name === tabName

const { updateFormAsync, isUpdating } = useForms()


const editDialog        = ref(false)
const isLoadingEdit     = ref(false)
const fileInput         = ref<HTMLInputElement | null>(null)
const imagePreview      = ref<string | null>(null)
const imageFile         = ref<File | null>(null)
const editAlertMessage  = ref<string | null>(null)
const editAlertSeverity = ref<'success' | 'error'>('error')

const editForm = reactive({
  name:        '',
  description: '',
  is_active:   true,
})

const editErrors = reactive({ name: '' })

watch(editDialog, async (open) => {
  if (!open) return
  isLoadingEdit.value = true
  try {
    const { data } = await formService.show(Number(formId))
    editForm.name        = data.title
    editForm.description = data.description ?? ''
    editForm.is_active   = data.is_active
    imagePreview.value   = data.img_url ?? null
  } finally {
    isLoadingEdit.value = false
  }
})

const triggerFileInput = () => fileInput.value?.click()

const handleFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) { imageFile.value = file; imagePreview.value = URL.createObjectURL(file) }
}

const handleDrop = (e: DragEvent) => {
  const file = e.dataTransfer?.files?.[0]
  if (file?.type.startsWith('image/')) { imageFile.value = file; imagePreview.value = URL.createObjectURL(file) }
}

const removeImage = () => {
  imagePreview.value = null
  imageFile.value    = null
  if (fileInput.value) fileInput.value.value = ''
}

const resetEdit = () => {
  editErrors.name        = ''
  editAlertMessage.value = null
  imageFile.value        = null
}

import { isAxiosError } from 'axios'

const handleSaveEdit = async () => {
  editErrors.name = ''
  if (!editForm.name.trim()) {
    editErrors.name = 'Name is required.'
    return
  }

  isLoadingEdit.value = true
  try {
    const payload = new FormData()
    payload.append('title', editForm.name)
    if (editForm.description) payload.append('description', editForm.description)
    payload.append('is_active', editForm.is_active ? '1' : '0')
    if (imageFile.value) payload.append('img', imageFile.value)

    await updateFormAsync({ id: Number(formId), payload })

    editAlertSeverity.value = 'success'
    editAlertMessage.value = 'Form updated successfully.'

    setTimeout(() => { editDialog.value = false }, 1000)
  } catch (err: unknown) {
    editAlertSeverity.value = 'error'
    if (isAxiosError(err)) {
      editAlertMessage.value = err.response?.data?.message ?? 'Failed to update form.'
    } else if (err instanceof Error) {
      editAlertMessage.value = err.message
    } else {
      editAlertMessage.value = 'Failed to update form.'
    }
  } finally {
    isLoadingEdit.value = false
  }
}

// --- show dialog ---

const showDialog    = ref(false)
const isLoadingShow = ref(false)
const formUrl       = ref<string | null>(null)
const qrCodeUrl     = ref<string | null>(null)
const copied        = ref(false)

const handleShow = async () => {
  showDialog.value = true
  if (formUrl.value) return
  isLoadingShow.value = true
  try {
    const { data } = await formService.show(Number(formId))
    formUrl.value   = data.url         ?? null
    qrCodeUrl.value = data.qr_code_url ?? null
  } finally {
    isLoadingShow.value = false
  }
}

const copyLink = async () => {
  if (!formUrl.value) return
  await navigator.clipboard.writeText(formUrl.value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>
