<template>
  <div class="relative w-full" style="height: 320px;">
    <canvas ref="canvasRef" class="w-full h-full" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import WordCloud from 'wordcloud'

const props = defineProps<{
  topics: Array<{
    label: string
    topic_id: number
    words: Array<{ text: string; value: number; rank: number }>
  }>
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)

const drawCloud = async () => {
  await nextTick()
  const canvas = canvasRef.value
  if (!canvas) return

  const parent = canvas.parentElement
  if (parent) {
    canvas.width  = parent.clientWidth
    canvas.height = parent.clientHeight
  }

  const seen = new Set<string>()
  const list: [string, number][] = []

  props.topics.forEach(topic => {
    topic.words.forEach(w => {
      if (!seen.has(w.text)) {
        seen.add(w.text)
        list.push([w.text, Math.max(14, 42 - w.rank * 2.5)])
      }
    })
  })

  WordCloud(canvas, {
    list,
    gridSize:        10,
    fontFamily:      'ui-sans-serif, system-ui, sans-serif',
    color:           () => {
      const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']
      return colors[Math.floor(Math.random() * colors.length)]
    },
    rotateRatio:     0.3,
    rotationSteps:   2,
    backgroundColor: 'transparent',
    shrinkToFit:     true,
  })
}

onMounted(drawCloud)
watch(() => props.topics, drawCloud, { deep: true })
</script>
