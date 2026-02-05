<template>
  <div class="flex flex-col h-screen bg-bg-muted">
    <BaseNavbar @toggle-sidebar="isCollapsed = !isCollapsed" />
    <div class="flex flex-1 overflow-hidden">
      <aside
        class="flex flex-col overflow-y-auto transition-[width] duration-300 ease-in-out"
        :class="isCollapsed ? 'w-20' : 'w-80'"
      >
        <div class="p-4" v-if="!isCollapsed">
          <h3 class="text-sm font-semibold text-text-muted uppercase tracking-wider">
            Main Navigation
          </h3>
        </div>
        <nav class="flex-1 p-2 space-y-2">
          <router-link
            v-for="link in items"
            :key="link.name"
            :to="{ name: link.name }"
            class="group flex items-center gap-4 px-4 py-2 rounded-lg transition-all duration-300"
            :class="[
              isLinkActive(link.name)
                ? 'bg-bg-primary text-primary font-medium'
                : 'text-text-muted hover:bg-bg-primary'
            ]"
          >
            <component
              :is="link.icon"
              stroke="2"
              class="w-5 h-5 shrink-0 transition-transform duration-300"
              :class="[
                isLinkActive(link.name)
                  ? 'text-primary'
                  : 'text-text-muted group-hover:text-primary'
              ]"
            />
            <Transition name="fade-slide">
              <span
                v-if="!isCollapsed"
                class="text-sm whitespace-nowrap"
              >
                {{ link.label }}
              </span>
            </Transition>
          </router-link>
        </nav>
      </aside>
      <main class="flex-1 overflow-y-auto px-6 py-2">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import BaseNavbar from '@/components/BaseNavbar.vue'
import {
  IconHome,
  IconForms,
  // IconChartBar,
  // IconTrash,
} from '@tabler/icons-vue'

const route = useRoute()

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
  // {
  //   name: 'reports',
  //   label: 'Reports',
  //   icon: IconChartBar,
  // },
  // {
  //   name: 'trash',
  //   label: 'Trash',
  //   icon: IconTrash,
  // }
]

const isCollapsed = ref(false)

const isLinkActive = (linkName: string) => {
  if (route.name === linkName) {
    return true
  }

  if (linkName === 'forms') {
    const formRoutes = ['formSuggestions', 'formSummary', '']
    return formRoutes.includes(route.name as string) && route.params.id
  }

  return false
}
</script>
