<template>
  <header>
    <div class="flex h-16 items-center justify-between px-6">
      <!-- Left Section -->
      <div class="flex items-center space-x-34">
        <div class="flex items-center space-x-4">
          <button
            @click="$emit('toggle-sidebar')"
            class="cursor-pointer rounded p-2 transition-all duration-300 bg-bg-primary border border-border-muted"
          >
            <IconMenu3 class="h-5 w-5 text-text-muted" />
          </button>

          <BaseBreadcrumb />
        </div>
      </div>

      <!-- Right Section (Profile + Dropdown) -->
      <div class="relative">
        <button
          @click="toggleDropdown"
          class="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-border-muted transition hover:ring-2 hover:ring-primary cursor-pointer"
        >
          <img
            src="https://picsum.photos/200"
            alt="Profile"
            class="h-full w-full object-cover"
          />
        </button>

        <!-- Dropdown -->
        <Transition
          enter-active-class="transition ease-out duration-100"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0"
        >
          <div
            v-if="isDropdownOpen"
            class="absolute right-0 z-50 mt-2 w-48 rounded-md border border-border-muted bg-white shadow-lg"
          >
            <div class="py-1">
              <button
                @click="handleLogout"
                :disabled="isSigningOut"
                class="flex w-full items-center space-x-2 px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <IconLogout class="h-4 w-4" />
                <span>
                  {{ isSigningOut ? 'Logging out...' : 'Log out' }}
                </span>
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
/* -----------------------------
 * Imports
 * ----------------------------- */
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import {
  IconMenu3,
  IconLogout,
} from '@tabler/icons-vue'

import BaseBreadcrumb from './base/breadcrumb/BaseBreadcrumb.vue'
import { useAuth } from '@/composables/auth/useAuth'

/* -----------------------------
 * State & Composables
 * ----------------------------- */
const router = useRouter()
const { signOut, isSigningOut } = useAuth()

const isDropdownOpen = ref(false)

/* -----------------------------
 * Methods
 * ----------------------------- */
const toggleDropdown = (): void => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const handleLogout = async (): Promise<void> => {
  try {
    await signOut()
    isDropdownOpen.value = false
    await router.push({ name: 'SignIn' })
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

const handleClickOutside = (event: MouseEvent): void => {
  const target = event.target as HTMLElement

  if (!target.closest('.relative')) {
    isDropdownOpen.value = false
  }
}

/* -----------------------------
 * Lifecycle
 * ----------------------------- */
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
