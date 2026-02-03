<template>
  <header>
    <div class="px-6 flex items-center justify-between h-16">
      <div class="flex items-center space-x-34">
        <button class="flex items-center space-x-2">
          <img src="../assets/img/logo.png" alt="Logo" class="h-10 w-auto object-contain">
          <span class="text-primary font-medium text-lg uppercase">
            tlc-suggest
          </span>
        </button>
        <div class="flex items-center space-x-4">
          <button @click="$emit('toggle-sidebar')"
            class="p-2 hover:bg-bg-primary cursor-pointer rounded transition-all duration-300">
            <IconChevronLeftPipe class="w-5 h-5 text-text-muted" />
          </button>
          <div class="">
            <BaseBreadcrumb />
          </div>
        </div>
      </div>
      <div class="relative">
        <button @click="toggleDropdown"
          class="relative flex items-center justify-center w-9 h-9 rounded-full overflow-hidden border border-border-muted hover:ring-2 hover:ring-primary transition cursor-pointer">
          <img src="https://picsum.photos/200" alt="Profile" class="w-full h-full object-cover" />
        </button>

        <!-- Dropdown Menu -->
        <Transition enter-active-class="transition ease-out duration-100"
          enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95">
          <div v-if="isDropdownOpen"
            class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white border border-border-muted z-50">
            <div class="py-1">
              <button @click="handleLogout" :disabled="isSigningOut"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <IconLogout class="w-4 h-4" />
                <span>{{ isSigningOut ? 'Logging out...' : 'Log out' }}</span>
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { IconChevronLeftPipe, IconLogout } from '@tabler/icons-vue'
import BaseBreadcrumb from './base/breadcrumb/BaseBreadcrumb.vue'
import { useAuth } from '@/composables/auth/useAuth'

const router = useRouter()
const { signOut, isSigningOut } = useAuth()
const isDropdownOpen = ref(false)

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const handleLogout = async () => {
  try {
    await signOut()
    isDropdownOpen.value = false

    await router.replace(router.currentRoute.value.fullPath)
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
