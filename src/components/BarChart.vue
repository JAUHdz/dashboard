<template>
  <canvas ref="chartCanvas"></canvas>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  alertas: Number,
  normales: Number
})

const chartCanvas = ref(null)
let chartInstance = null

onMounted(() => {
  renderChart()
})

watch(() => [props.alertas, props.normales], () => {
  if (chartInstance) chartInstance.destroy()
  renderChart()
})

function renderChart() {
  if (!chartCanvas.value) return

  chartInstance = new Chart(chartCanvas.value, {
    type: 'pie',
    data: {
      labels: ['Alertas', 'Normales'],
      datasets: [{
        label: 'Registros',
        data: [props.alertas, props.normales],
        backgroundColor: ['#f44336', '#4caf50']
      }]
    },
    options: {
      responsive: true
    }
  })
}
</script>
