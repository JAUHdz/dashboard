<template>
  <canvas ref="chartCanvas"></canvas>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  ritmos: Array // [{ bpm: 78, fecha: '2025-07-31T12:30:00Z' }, ...]
})

const chartCanvas = ref(null)
let chartInstance = null

onMounted(() => renderChart())

watch(() => props.ritmos, () => {
  if (chartInstance) chartInstance.destroy()
  renderChart()
})

function renderChart() {
  if (!chartCanvas.value || props.ritmos.length === 0) return

  const labels = props.ritmos.map(r => new Date(r.fecha).toLocaleString())
  const data = props.ritmos.map(r => r.bpm)

  chartInstance = new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Ritmo Cardíaco (BPM)',
        data,
        borderColor: '#f50057',
        backgroundColor: 'rgba(245, 0, 87, 0.2)',
        tension: 0.3,
        fill: true,
        pointRadius: 3
      }]
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.parsed.y} BPM`
          }
        }
      },
      scales: {
        y: {
          title: {
            display: true,
            text: 'BPM'
          },
          min: 40,
          max: 180
        },
        x: {
          title: {
            display: true,
            text: 'Fecha'
          }
        }
      }
    }
  })
}
</script>
