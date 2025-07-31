<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="light">
        <ion-title>Dashboard de Alda's Logistic</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <!-- Cards -->
      <ion-grid>
        <ion-row>
          <ion-col size="6" size-md="3" v-for="card in cards" :key="card.title">
           <ion-card :style="{ borderTop: `6px solid ${card.color}` }">
              <ion-card-header class="card-header">
                <ion-icon :name="card.icon" size="large" :style="{ color: card.color }"></ion-icon>
                <ion-card-title>{{ card.title }}</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <h2>{{ card.value }}</h2>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>

      <!-- Botón -->
      <ion-button expand="block" color="primary" @click="mostrarEmpleados">
        Mostrar Empleados
      </ion-button>

      <!-- Mapa -->
      <div id="map" style="height: 400px; margin: 20px 0;"></div>

      <ion-card v-if="cardVisible" class="ion-margin-top">
  <ion-card-header>
    <ion-card-title>Datos de {{ empleadoSeleccionado?.nombre }}</ion-card-title>
  </ion-card-header>
  <ion-card-content>
    
    

    <div style="display: flex; justify-content: space-around; gap: 10px; margin-top: 15px;">
      <p><strong>Alertas</strong></p>
      <BarChart
        :alertas="registrosPorEmpleado().alertas"
        :normales="registrosPorEmpleado().normales"
        style="width: 30%; height: 160px;"
      />
<p><strong>Ritmo cardíaco</strong></p>
      <HeartRateChart
  :ritmos="registrosPorEmpleado().ritmos"
  style="width: 30%; height: 180px;"
/>

    </div>
  </ion-card-content>
</ion-card>



      <!-- Alertas Recientes -->
      <ion-card id="ultimo-card">
        <ion-card-header>
          <ion-card-title>Alertas</ion-card-title>
        </ion-card-header>
        <ion-card-content>
      
          <div v-if="mostrarTabla">
            <ion-grid>
              <ion-row>
                <ion-col><strong>Nombre</strong></ion-col>
                <ion-col><strong>Mensaje</strong></ion-col>
                <ion-col><strong>Fecha</strong></ion-col>
              </ion-row>

              <!-- Filas con íconos -->
              <ion-row v-for="alerta in alertas" :key="alerta.id">
                <ion-col>
                  <ion-icon 
                    :name="alerta.icono" 
                    :color="alerta.color" 
                    style="margin-right: 8px;"
                  ></ion-icon>
                  {{ alerta.nombre }}
                </ion-col>
                <ion-col>{{ alerta.mensaje }}</ion-col>
                <ion-col>{{ alerta.fecha }}</ion-col>
              </ion-row>
            </ion-grid>
          </div>

          <p v-if="!mostrarTabla && (!alertas || alertas.length === 0)">No hay alertas recientes.</p>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import BarChart from '@/components/BarChart.vue'
import HeartRateChart from '@/components/HeartRateChart.vue'
import { supabase } from '@/lib/supebase'

const cards = ref([
  { title: 'Empleados Activos', value: 0, color: '#3880ff' },
  { title: 'Eventos Hoy', value: 0, color: '#10dc60' },
  { title: 'Alertas Activas', value: 0, color: '#f04141' },
  { title: 'Ritmo cardíaco promedio', value: '0%', color: '#ffce00' }
])

let map = null
const mostrarTabla = ref(false)
const empleados = ref([])
const cardVisible = ref(false)
const empleadoSeleccionado = ref(null)


onMounted(() => {
  map = L.map('map').setView([23.6345, -102.5528], 5) // <- ya no uses const

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)
})

const cargarDatos = async () => {
  const { data, error } = await supabase
    .from('biometric_data')
    .select('*')
  if (error) {
    console.error('Error al cargar:', error)
  } else {
    empleados.value = data
    console.log('Empleados:', empleados.value)
    console.log('Datos:', data)
    actualizarCards()
    mostrarMarcadores()
    cargarAlertas()
    registrosPorEmpleado()
  }
}

const suscribirseRealtime = () => {
  supabase
    .channel('public:biometric_data') // nombre del canal: esquema:tabla
    .on(
      'postgres_changes',              // tipo de evento Realtime
      { event: '*', schema: 'public', table: 'biometric_data' },  // filtro
      (payload) => {
        console.log('Evento realtime:', payload)
        cargarDatos()
      }
    )
    .subscribe()
}

const actualizarCards = () => {
  const ahora = new Date()
const cincoMinutosMs = 5 * 60 * 1000

const activos = empleados.value.filter(dato => {
  const fecha = new Date(dato.synced_at)
  return ahora - fecha <= cincoMinutosMs
})


  const hoy = new Date()
  const eventosHoy = empleados.value.filter(dato => {
    const fecha = new Date(dato.synced_at)
    return (
      fecha.getFullYear() === hoy.getFullYear() &&
      fecha.getMonth() === hoy.getMonth() &&
      fecha.getDate() === hoy.getDate()
    )
  })

  const alertas = empleados.value.filter(dato =>
    dato.audio_path.toLowerCase().includes('alerta')
  )

  const promedioHR = empleados.value.length
    ? Math.round(empleados.value.reduce((acc, d) => acc + d.heart_rate, 0) / empleados.value.length)
    : 0

  cards.value[0].value = activos.length
  cards.value[1].value = eventosHoy.length
  cards.value[2].value = alertas.length
  cards.value[3].value = `${promedioHR} bpm` // reemplaza el estrés por ritmo cardíaco promedio
}




const mostrarEmpleados = () => {
  mostrarTabla.value = true
  cargarDatos()
  suscribirseRealtime()
  
}

const mostrarMarcadores = () => {
  // Limpiar marcadores existentes
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer)
    }
  })

  empleados.value.forEach((empleado) => {
    if (!empleado.latitude || !empleado.longitude) return // evitar errores

    const icon = L.icon({
      iconUrl: empleado.audio_path?.toLowerCase().includes('alerta')
        ? 'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png'
        : 'https://maps.gstatic.com/mapfiles/ms2/micons/green-dot.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    })

    L.marker([empleado.latitude, empleado.longitude], { icon })
      .addTo(map)
      .bindPopup(`<b>${empleado.nombre}</b><br>${empleado.audio_path?.toLowerCase().includes('alerta') ? '🚨 Alerta' : '🟢 Normal'}`)
      .on('click', () => {
        empleadoSeleccionado.value = empleado
        cardVisible.value = true
      })
  })
}



// Ahora cada alerta incluye icono y color para el ion-icon
const alertas = ref([])

function cargarAlertas() {
  alertas.value = empleados.value.map((e, index) => ({
    id: index + 1,
    mensaje: e.audio_path,
    fecha: new Date(e.synced_at).toISOString().split('T')[0],
    icono: e.audio_path?.toLowerCase().includes('alerta') ? 'warning' : 'cloudy',
    color: e.audio_path?.toLowerCase().includes('alerta') ? 'danger' : 'medium',
    nombre: e.nombre
  }))
}

function registrosPorEmpleado() {
  if (!empleadoSeleccionado.value) {
    return {
      alertas: 0,
      normales: 0,
      promedioRitmo: 0,
      ritmos: []
    }
  }

  const registros = empleados.value.filter(e => e.nombre === empleadoSeleccionado.value.nombre)

  const alertas = registros.filter(r => r.audio_path?.toLowerCase().includes('alerta')).length
  const normales = registros.length - alertas

  const ritmos = registros
    .filter(r => r.heart_rate && r.synced_at)
    .map(r => ({
      bpm: r.heart_rate,
      fecha: r.synced_at
    }))

  const promedioRitmo = ritmos.length > 0
    ? Math.round(ritmos.reduce((acc, r) => acc + r.bpm, 0) / ritmos.length)
    : 0

  return { alertas, normales, promedioRitmo, ritmos }
}



</script>

<style scoped>
.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

#ultimo-card {
  margin-bottom: 200px;
}

h2 {
  font-size: 24px;
  margin: 0;
  color: #0300a8;
}

ion-card {
  transition: transform 0.2s;
}

ion-card:hover {
  transform: scale(1.02);
}
</style>

