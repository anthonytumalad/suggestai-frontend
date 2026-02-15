<template>
  <div class="h-screen bg-bg-muted">
    <!-- Fixed Sidebar -->
    <aside
      :class="[
        isCollapsed ? 'w-20' : 'w-70',
      ]"
      class="fixed left-0 top-0 z-40 flex h-screen flex-col overflow-y-auto border-r border-border-muted bg-bg-primary transition-[width] duration-300 ease-in-out"
    >
      <!-- Logo -->
      <div class="flex items-center space-x-2 p-4">
        <img
          src="../assets/img/logo.png"
          alt="Logo"
          class="h-10 w-auto object-contain"
        />
        <span
          v-if="!isCollapsed"
          class="text-lg font-medium uppercase text-primary"
        >
          tlc-suggest
        </span>
      </div>

      <!-- Navigation -->
      <div v-if="!isCollapsed" class="px-4 pb-2">
        <h3 class="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Main Navigation
        </h3>
      </div>

      <nav class="flex-1 space-y-2 p-2">
        <router-link
          v-for="link in items"
          :key="link.name"
          :to="{ name: link.name }"
          class="group flex items-center gap-4 rounded-lg px-4 py-2 transition-all duration-300"
          :class="[
            isLinkActive(link.name)
              ? 'bg-bg-muted font-medium text-primary'
              : 'text-text-muted hover:bg-bg-muted hover:text-primary'
          ]"
        >
          <component
            :is="link.icon"
            stroke="2"
            class="h-5 w-5 shrink-0 transition-transform duration-300"
            :class="[
              isLinkActive(link.name)
                ? 'text-primary'
                : 'text-text-muted group-hover:text-primary'
            ]"
          />

          <span
            v-if="!isCollapsed"
            class="whitespace-nowrap text-sm"
          >
            {{ link.label }}
          </span>
        </router-link>
      </nav>
    </aside>

    <!-- Content Wrapper -->
    <div
      :class="isCollapsed ? 'ml-20' : 'ml-70'"
      class="flex h-screen flex-col transition-all duration-300"
    >
      <!-- Navbar -->
      <BaseNavbar @toggle-sidebar="isCollapsed = !isCollapsed" />

      <!-- Scrollable Content -->
      <main class="flex-1 overflow-y-auto px-6 py-4">
        <router-view />
      </main>
    </div>
  </div>
</template>


<script setup lang="ts">
/* -----------------------------
 * Imports
 * ----------------------------- */
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import BaseNavbar from '@/components/BaseNavbar.vue'

import {
  IconForms,
  IconHome,
} from '@tabler/icons-vue'

/* -----------------------------
 * State
 * ----------------------------- */
const route = useRoute()
const isCollapsed = ref(false)

/* -----------------------------
 * Navigation Items
 * ----------------------------- */
const items = [
  {
    name: 'dashboard',
    label: 'Home',
    icon: IconHome,
  },
  {
    name: 'forms',
    label: 'Forms',
    icon: IconForms,
  },
]

/* -----------------------------
 * Helpers
 * ----------------------------- */
const isLinkActive = (linkName: string): boolean => {
  if (route.name === linkName) {
    return true
  }

  if (linkName === 'forms') {
    const formRoutes = [
      'formSuggestions',
      'formSummary',
      '',
    ]

    return (
      formRoutes.includes(route.name as string) &&
      !!route.params.id
    )
  }

  return false
}
</script>
