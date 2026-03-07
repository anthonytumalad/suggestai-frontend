<template>
  <apexchart type="donut" height="280" :options="options" :series="series" />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ clustered: number; outliers: number }>()

const series = computed(() => [props.clustered, props.outliers])

const options = computed(() => ({
  chart: {
    background: 'transparent',
  },
  labels: ['Clustered', 'Outliers'],
  colors: ['#0EA5E9', '#e5e7eb'],
  legend: {
    position: 'bottom',
    labels: { colors: '#0EA5E9' },
  },
  dataLabels: {
    style: { fontSize: '12px' },
  },
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
            formatter: (w: { globals: { seriesTotals: number[] } }) => w.globals.seriesTotals.reduce((a, b) => a + b, 0),
          },
        },
      },
    },
  },
  stroke: { show: false },
  tooltip: { enabled: true },
}))
</script>
