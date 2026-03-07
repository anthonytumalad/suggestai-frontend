<template>
  <header>
    <div class="flex h-16 items-center justify-between px-6 border-b border-border-muted">

      <div class="flex items-center space-x-10">
        <button
          @click="$emit('toggle-sidebar')"
          class="cursor-pointer rounded p-2 transition-all duration-300 bg-bg-primary border border-border-muted"
        >
          <IconMenu3 class="h-5 w-5 text-text-muted" />
        </button>

        <nav class="flex items-center space-x-2 text-sm">
          <router-link
            v-for="(crumb, index) in breadcrumbs"
            :key="index"
            :to="crumb.to"
            class="flex items-center space-x-2 group"
          >
            <span
              class="transition-colors duration-200"
              :class="
                index === breadcrumbs.length - 1
                  ? 'text-text-base font-medium'
                  : 'text-text-muted hover:text-primary'
              "
            >
              {{ crumb.label }}
            </span>

            <IconChevronRight
              v-if="index < breadcrumbs.length - 1"
              class="w-4 h-4 text-text-muted"
            />
          </router-link>
        </nav>
      </div>

      <div class="relative">
        <button
          @click="toggleDropdown"
          class="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-border-muted transition hover:ring-2 hover:ring-primary cursor-pointer"
        >
          <IconUser class="h-5 w-5 text-text-muted" />
        </button>

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
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'

import {
  IconMenu3,
  IconLogout,
  IconUser,
  IconChevronRight
} from '@tabler/icons-vue'

import { useAuth } from '@/composables/auth/useAuth'

const router = useRouter()
const route = useRoute()

const { signOut, isSigningOut } = useAuth()

const isDropdownOpen = ref(false)

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

onMounted(() =>
  document.addEventListener('click', handleClickOutside)
)

onBeforeUnmount(() =>
  document.removeEventListener('click', handleClickOutside)
)

interface Breadcrumb {
  label: string
  to: RouteLocationRaw
}

const breadcrumbs = computed((): Breadcrumb[] => {
  const crumbs: Breadcrumb[] = [
    { label: 'Home', to: { name: 'dashboard' } }
  ]

  if (route.name === 'forms' || route.name === 'addForm') {
    crumbs.push({ label: 'Forms', to: { name: 'forms' } })

    if (route.name === 'addForm') {
      crumbs.push({ label: 'Add Form', to: { name: 'addForm' } })
    }
  }

  if (route.params.id) {
    const formTitle = (route.query.title as string) || 'Form'

    crumbs.push({ label: 'Forms', to: { name: 'forms' } })

    crumbs.push({
      label: formTitle,
      to: {
        name: '',
        params: { id: route.params.id },
        query: { title: formTitle }
      }
    })

    if (route.name === 'formSuggestions') {
      crumbs.push({
        label: 'Suggestions',
        to: {
          name: 'formSuggestions',
          params: { id: route.params.id },
          query: { title: formTitle }
        }
      })
    } else if (route.name === 'formSummary') {
      crumbs.push({
        label: 'Summary',
        to: {
          name: 'formSummary',
          params: { id: route.params.id },
          query: { title: formTitle }
        }
      })
    } else if (route.name === 'formOverview') {
      crumbs.push({
        label: 'Overview',
        to: {
          name: 'formOverview',
          params: { id: route.params.id },
          query: { title: formTitle }
        }
      })
    }
  }

  if (route.name === 'reports') {
    crumbs.push({ label: 'Reports', to: { name: 'reports' } })
  }

  if (route.name === 'trash') {
    crumbs.push({ label: 'Trash', to: { name: 'trash' } })
  }

  return crumbs
})
</script>
