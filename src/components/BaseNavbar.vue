<template>
  <header>
    <div class="px-6 flex items-center justify-between h-16">
      <div class="flex items-center space-x-34">
        <button class="flex items-center space-x-2">
          <img
            src="../assets/img/logo.png"
            alt="Logo"
            class="h-10 w-auto object-contain"
          >
          <span class="text-primary font-medium text-lg uppercase">
            tlc-suggest
          </span>
        </button>
        <button
          @click="$emit('toggle-sidebar')"
          class="p-2"
        >
          <IconChevronLeftPipe
            class="w-5 h-5 text-text-muted"
          />
        </button>
      </div>
      <div>
        <button
          class="relative flex items-center justify-center w-9 h-9 rounded-full overflow-hidden border border-border-muted hover:ring-2 hover:ring-primary transition cursor-pointer"
        >
          <img
            src="https://picsum.photos/200"
            alt="Profile"
            class="w-full h-full object-cover"
          />
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { IconChevronLeftPipe } from '@tabler/icons-vue'
</script>
