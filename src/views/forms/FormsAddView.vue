<template>
  <div class="flex justify-center mx-auto py-8">
    <div class="w-full max-w-xl flex flex-col space-y-3">

      <!-- Page Title -->
      <div class="mb-2">
        <h1 class="text-xl font-semibold text-text-base">Add Form</h1>
        <p class="text-sm text-text-muted">Create a new suggestion form.</p>
      </div>

      <!-- Alerts -->
      <BaseAlert
        v-if="alertMessage"
        :severity="alertSeverity"
        :message="alertMessage"
        :closable="true"
        @close="alertMessage = null"
      />

      <!-- Image Upload -->
      <div
        class="relative w-full h-34 rounded border-2 border-dashed border-border-muted bg-white overflow-hidden cursor-pointer group"
        @click="triggerFileInput"
        @dragover.prevent
        @drop.prevent="handleDrop"
      >
        <!-- Preview -->
        <img
          v-if="imagePreview"
          :src="imagePreview"
          alt="Cover preview"
          class="w-full h-full object-cover"
        />

        <!-- Placeholder -->
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

        <!-- Remove button -->
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

        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleFileChange"
        />
      </div>

      <!-- Details Card -->
      <div class="bg-white border border-border-muted rounded">
        <div class="px-6 py-5 space-y-4">

          <!-- Name -->
          <div class="flex flex-col space-y-1.5">
            <BaseInput
              v-model="form.name"
              placeholder="Enter form name"
              size="sm"
              :inputClass="errors.name ? 'border-red-400' : ''"
              @input="errors.name = ''"
            />
            <span v-if="errors.name" class="text-xs text-red-500">{{ errors.name }}</span>
          </div>

          <!-- Description -->
          <div class="flex flex-col space-y-1.5">
            <label class="text-sm text-text-base">
              Description
              <span class="text-text-muted text-xs">(optional)</span>
            </label>
            <BaseTextarea
              v-model="form.description"
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

        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-between text-sm pt-1">
        <BaseButton
          variant="primary"
          label="Add form"
          size="sm"
          :disabled="isCreating"
          @click="handleSave"
          :loading="isCreating"
        />
        <button
          type="button"
          class="cursor-pointer hover:underline text-text-muted"
          @click="router.push({ name: 'forms' })"
        >
          Cancel
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { isAxiosError } from 'axios'
import { useForms } from '@/composables/forms/useForm'

const router = useRouter()

const { createFormAsync, isCreating } = useForms()

const fileInput    = ref<HTMLInputElement | null>(null)
const imagePreview = ref<string | null>(null)
const imageFile    = ref<File | null>(null)

const form = reactive({
  name:        '',
  description: '',
  is_active:   true,
})

const errors = reactive({ name: '' })

const alertMessage  = ref<string | null>(null)
const alertSeverity = ref<'success' | 'error'>('error')

const triggerFileInput = () => fileInput.value?.click()

const handleFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) setImage(file)
}

const handleDrop = (e: DragEvent) => {
  const file = e.dataTransfer?.files?.[0]
  if (file && file.type.startsWith('image/')) setImage(file)
}

const setImage = (file: File) => {
  imageFile.value    = file
  imagePreview.value = URL.createObjectURL(file)
}

const removeImage = () => {
  imagePreview.value = null
  imageFile.value    = null
  if (fileInput.value) fileInput.value.value = ''
}

const validate = (): boolean => {
  errors.name = ''
  if (!form.name.trim()) {
    errors.name = 'Name is required.'
    return false
  }
  return true
}

const handleSave = async () => {
  if (!validate()) return

  alertMessage.value = null

  try {
    const payload = new FormData()
    payload.append('name', form.name)
    if (form.description) payload.append('description', form.description)
    payload.append('is_active', String(form.is_active))
    if (imageFile.value) payload.append('img', imageFile.value)

    await createFormAsync(payload)

    alertSeverity.value = 'success'
    alertMessage.value  = 'Form created successfully.'

    setTimeout(() => router.push({ name: 'forms' }), 1000)
  } catch (err) {
    alertSeverity.value = 'error'
    alertMessage.value  = isAxiosError(err)
      ? err.response?.data?.message ?? 'Failed to create form.'
      : 'An unexpected error occurred.'
  }
}
</script>
