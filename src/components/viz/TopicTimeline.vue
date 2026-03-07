<template>
  <apexchart
    type="line"
    height="280"
    :options="options"
    :series="series"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  topics: Array<{
    label: string
    data: Array<{ date: string; count: number }>
  }>
}>()

const colors = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4']

const series = computed(() =>
  props.topics.map(topic => ({
    name: topic.label,
    data: topic.data.map(d => ({
      x: d.date,
      y: d.count,
    })),
  }))
)

const options = computed(() => ({
  chart: {
    toolbar: { show: false },
    background: 'transparent',
    zoom: { enabled: false },
  },
  stroke: {
    curve: 'smooth',
    width: 2,
  },
  markers: { size: 4 },
  colors,
  xaxis: {
    type: 'datetime',
    labels: { style: { colors: '#9ca3af' } },
  },
  yaxis: {
    labels: {
      style: { colors: '#9ca3af' },
      formatter: (v: number) => Math.round(v),
    },
  },
  grid: {
    borderColor: '#e5e7eb',
    strokeDashArray: 4,
  },
  legend: {
    position: 'bottom',
    labels: { colors: '#6b7280' },
  },
  tooltip: { x: { format: 'MMM dd, yyyy' } },
}))
</script>
