<template>
  <div class="flex items-center justify-between border-b border-border-muted pb-4">
    <h1 class="text-3xl font-medium text-text-base">
      {{ title }}
    </h1>
    <div class="flex items-center space-x-2">
      <BaseButton
        variant="outline"
        :icon="IconQrcode"
        size="sm"
        @click="showQrDialog = true"
      />
      <BaseButton
        variant="outline"
        :icon="IconDownload"
        size="sm"
        @click="$emit('download')"
      />
      <BaseButton
        variant="outline"
        :icon="IconEdit"
        size="sm"
        @click="$emit('edit')"
      />
      <BaseButton
        variant="outline"
        :icon="IconTrashX"
        size="sm"
        @click="$emit('delete')"
      />
    </div>
  </div>

  <!-- QR Code & Link Dialog -->
  <BaseDialog v-model="showQrDialog" title="Share Form" size="md">
    <div class="space-y-6">
      <!-- QR Code -->
      <div class="flex flex-col items-center space-y-4">
        <div class="bg-white p-4 rounded-lg border-2 border-border-muted">
          <img
            :src="qrCodeUrl"
            :alt="`QR Code for ${title}`"
            class="w-64 h-64"
          />
        </div>
        <p class="text-sm text-text-muted text-center">
          Scan this QR code to access the form
        </p>
      </div>

      <!-- Form Link -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-text-base">Form Link</label>
        <div class="flex items-center space-x-2">
          <input
            :value="formUrl"
            readonly
            class="flex-1 px-3 py-2 text-sm border border-border-muted rounded bg-bg-muted text-text-base"
            @focus="($event.target as HTMLInputElement).select()"
          />
          <BaseButton
            variant="outline"
            :icon="copied ? IconCheck : IconCopy"
            size="sm"
            @click="copyToClipboard"
          />
        </div>
        <p v-if="copied" class="text-xs text-green-600">
          Link copied to clipboard!
        </p>
      </div>
    </div>

    <template #footer>
      <BaseButton
        variant="primary"
        size="sm"
        label="Download QR Code"
        :icon="IconDownload"
        @click="downloadQrCode"
      />
      <BaseButton
        variant="outline"
        size="sm"
        label="Close"
        @click="showQrDialog = false"
      />
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconDownload, IconEdit, IconTrashX, IconQrcode, IconCopy, IconCheck } from '@tabler/icons-vue'

const props = defineProps<{
  title: string
  formUrl: string
  qrCodeUrl: string
}>()

defineEmits<{
  download: []
  edit: []
  delete: []
}>()

const showQrDialog = ref(false)
const copied = ref(false)

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.formUrl)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const downloadQrCode = () => {
  const link = document.createElement('a')
  link.href = props.qrCodeUrl
  link.download = `${props.title}-qr-code.svg`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>
