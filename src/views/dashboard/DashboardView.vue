<template>
  <div class="flex flex-col gap-6 px-6 py-8">
    <template v-if="isLoading">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          v-for="i in 4"
          :key="i"
          class="h-24 bg-bg-muted animate-pulse rounded border border-border-muted"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="i in 4"
          :key="i"
          class="h-72 bg-bg-muted animate-pulse rounded border border-border-muted"
        />
      </div>
    </template>

    <template v-else>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Forms"
          :value="stats?.total_forms ?? 0"
          :icon="IconForms"
        />

        <StatCard
          label="Total Suggestions"
          :value="stats?.total_suggestions ?? 0"
          :icon="IconMessage"
        />

        <StatCard
          label="This Month"
          :value="stats?.this_month ?? 0"
          :icon="IconCalendar"
        />

        <StatCard
          label="Topic Sessions"
          :value="stats?.total_sessions ?? 0"
          :icon="IconBrain"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-2 bg-bg-primary border border-border-muted rounded p-5">
          <p class="text-sm font-medium text-text-base mb-0.5">
            Suggestions Over Time
          </p>
          <p class="text-xs text-text-muted mb-4">
            Last 30 days
          </p>

          <apexchart
            type="area"
            height="220"
            :options="timelineOptions"
            :series="timelineSeries"
          />
        </div>

        <div class="bg-bg-primary border border-border-muted rounded p-5">
          <p class="text-sm font-medium text-text-base mb-0.5">
            Anonymous vs Identified
          </p>
          <p class="text-xs text-text-muted mb-4">
            All time ratio
          </p>

          <apexchart
            type="donut"
            height="220"
            :options="donutOptions"
            :series="donutSeries"
          />
        </div>

        <div class="md:col-span-2 bg-bg-primary border border-border-muted rounded p-5">
          <p class="text-sm font-medium text-text-base mb-0.5">
            Suggestions per Form
          </p>
          <p class="text-xs text-text-muted mb-4">
            Top 6 forms
          </p>

          <apexchart
            type="bar"
            height="220"
            :options="barOptions"
            :series="barSeries"
          />
        </div>

        <div class="bg-bg-primary border border-border-muted rounded p-5 flex flex-col gap-3">
          <div>
            <p class="text-sm font-medium text-text-base mb-0.5">
              Recent Suggestions
            </p>
            <p class="text-xs text-text-muted">
              Latest activity
            </p>
          </div>

          <div class="flex flex-col gap-2 overflow-y-auto max-h-56">
            <div
              v-for="s in recentSuggestions"
              :key="s.id"
              class="flex flex-col gap-0.5 py-2 border-b border-border-muted last:border-0"
            >
              <div class="flex items-center justify-between gap-2">
                <span class="text-xs font-medium text-primary truncate">
                  {{ s.form?.title ?? 'Unknown Form' }}
                </span>

                <span class="text-xs text-text-muted shrink-0">
                  {{ formatRelative(s.created_at) }}
                </span>
              </div>

              <p class="text-xs text-text-muted line-clamp-2">
                {{ s.suggestion }}
              </p>

              <span
                class="text-xs"
                :class="
                  s.is_anonymous
                    ? 'text-text-muted italic'
                    : 'text-text-base'
                "
              >
                {{ s.is_anonymous ? 'Anonymous' : (s.student?.email ?? 'Unknown') }}
              </span>
            </div>

            <p
              v-if="!recentSuggestions.length"
              class="text-xs text-text-muted text-center py-4"
            >
              No suggestions yet
            </p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  IconMessageCircle as IconMessage,
  IconLayoutGrid as IconForms,
  IconCalendar,
  IconBrain
} from '@tabler/icons-vue'

import { useDashboard } from '@/composables/forms/useDashboard'
import StatCard from '@/components/viz/StatCard.vue'

const {
  stats,
  timeline,
  perForm,
  anonymousRatio,
  recentSuggestions,
  isLoading
} = useDashboard()

const timelineSeries = computed(() => [
  {
    name: 'Suggestions',
    data: timeline.value.map((d: { date: string; count: number }) => ({
      x: d.date,
      y: d.count
    }))
  }
])

const timelineOptions = computed(() => ({
  chart: {
    background: 'transparent',
    toolbar: { show: false },
    sparkline: { enabled: false }
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.3,
      opacityTo: 0
    }
  },
  colors: ['#0EA5E9'],
  xaxis: {
    type: 'datetime',
    labels: {
      style: { colors: '#9ca3af', fontSize: '11px' }
    }
  },
  yaxis: {
    labels: {
      style: { colors: '#9ca3af', fontSize: '11px' }
    }
  },
  grid: { borderColor: '#f3f4f6' },
  tooltip: { x: { format: 'MMM dd' } },
  dataLabels: { enabled: false }
}))

const donutSeries = computed(() => [
  anonymousRatio.value?.anonymous ?? 0,
  anonymousRatio.value?.identified ?? 0
])

const donutOptions = computed(() => ({
  chart: { background: 'transparent' },
  labels: ['Anonymous', 'Identified'],
  colors: ['#e5e7eb', '#0EA5E9'],
  legend: {
    position: 'bottom',
    labels: { colors: '#6b7280' }
  },
  stroke: { show: false },
  dataLabels: { style: { fontSize: '11px' } },
  plotOptions: {
    pie: {
      donut: {
        size: '65%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total',
            color: '#6b7280',
            formatter: (w: { globals: { seriesTotals: number[] } }) =>
              w.globals.seriesTotals.reduce((a, b) => a + b, 0)
          }
        }
      }
    }
  }
}))

const barSeries = computed(() => [
  {
    name: 'Suggestions',
    data: perForm.value.map(
      (f: { suggestions_count: number }) => f.suggestions_count
    )
  }
])

const barOptions = computed(() => ({
  chart: {
    background: 'transparent',
    toolbar: { show: false }
  },
  colors: ['#0EA5E9'],
  xaxis: {
    categories: perForm.value.map((f: { title: string }) =>
      f.title.length > 16
        ? f.title.substring(0, 16) + '…'
        : f.title
    ),
    labels: {
      style: { colors: '#9ca3af', fontSize: '11px' }
    }
  },
  yaxis: {
    labels: {
      style: { colors: '#9ca3af', fontSize: '11px' }
    }
  },
  grid: { borderColor: '#f3f4f6' },
  plotOptions: {
    bar: {
      borderRadius: 4,
      columnWidth: '50%'
    }
  },
  dataLabels: { enabled: false }
}))

const formatRelative = (date: string) => {
  const diff = Math.floor(
    (Date.now() - new Date(date).getTime()) / 1000
  )

  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`

  return `${Math.floor(diff / 86400)}d ago`
}
</script>
