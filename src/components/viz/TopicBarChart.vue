<template>
  <apexchart
    type="bar"
    height="280"
    :options="options"
    :series="series"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  data: Array<{ label: string; count: number; score: number }>
}>()

const series = computed(() => [{
  name: 'Documents',
  data: props.data.map(d => d.count),
}])

const options = computed(() => ({
  chart: {
    toolbar: { show: false },
    background: 'transparent',
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      columnWidth: '55%',
    },
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: props.data.map(d => d.label),
    labels: {
      style: { colors: '#9ca3af', fontSize: '11px' },
      rotate: -35,
    },
  },
  yaxis: {
    labels: { style: { colors: '#9ca3af' } },
  },
  colors: ['#0EA5E9'],
  grid: {
    borderColor: '#e5e7eb',
    strokeDashArray: 4,
  },
  tooltip: {
    y: { title: { formatter: () => 'Documents' } },
  },
  theme: { mode: 'light' },
}))
</script>
