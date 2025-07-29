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
    <p><strong>Ubicación:</strong> Lat: {{ empleadoSeleccionado?.lat }}, Lng: {{ empleadoSeleccionado?.lng }}</p>
    <p><strong>Estado:</strong> {{ empleadoSeleccionado?.emergencia ? '🚨 Emergencia' : '🟢 Normal' }}</p>

    <!-- Simulación de gráfica -->
    <div style="height: 150px; background: linear-gradient(to top, #3880ff {{ empleadoSeleccionado?.emergencia ? '100%' : '40%' }}, transparent); border-radius: 8px; margin-top: 10px;"></div>
  </ion-card-content>
</ion-card>



      <!-- Alertas Recientes -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>Alertas Recientes</ion-card-title>
        </ion-card-header>
        <ion-card-content>
      
          <div v-if="mostrarTabla">
            <ion-grid>
              <ion-row>
                <ion-col><strong>ID</strong></ion-col>
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
                  {{ alerta.id }}
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

const cards = ref([
  { title: 'Empleados Activos', value: 0, color: '#3880ff' },
  { title: 'Eventos Hoy', value: 0, color: '#10dc60' },
  { title: 'Alertas Activas', value: 0, color: '#f04141' },
  { title: 'Estrés Promedio de los Empleados', value: '0%', color: '#ffce00' }
])

let map = null
const mostrarTabla = ref(false)

onMounted(() => {
  map = L.map('map').setView([23.6345, -102.5528], 5) // <- ya no uses const

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)
})


const cardVisible = ref(false)
const empleadoSeleccionado = ref(null)


const mostrarEmpleados = () => {
  // Actualizar cards
  cards.value[0].value = empleados.length
  cards.value[1].value = 4
  cards.value[2].value = empleados.filter(e => e.emergencia).length
  cards.value[3].value = '27%'

  mostrarTabla.value = true
  // Limpiar marcadores anteriores si es necesario (opcional)

  empleados.forEach((empleado) => {
    const icon = L.icon({
      iconUrl: empleado.emergencia
        ? 'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png'
        : 'https://maps.gstatic.com/mapfiles/ms2/micons/green-dot.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    })

    L.marker([empleado.lat, empleado.lng], { icon })
      .addTo(map)
      .bindPopup(`<b>${empleado.nombre}</b><br>${empleado.emergencia ? '🚨 Emergencia' : '🟢 Normal'}`)
      .on('click', () => {
        empleadoSeleccionado.value = empleado
        cardVisible.value = true
      })
  })
}
const empleados = [
  { nombre: 'Luis García', lat: 19.4326, lng: -99.1332, emergencia: false },
  { nombre: 'Ana Torres', lat: 20.6597, lng: -103.3496, emergencia: true },
  { nombre: 'Pedro Martínez', lat: 21.1619, lng: -86.8515, emergencia: false }
]




// Ahora cada alerta incluye icono y color para el ion-icon
const alertas = ref([
  { id: 1, mensaje: 'Incidente en ruta 45', fecha: '2025-07-28', icono: 'warning', color: 'danger' },
  { id: 2, mensaje: 'Retraso por clima', fecha: '2025-07-27', icono: 'cloudy', color: 'medium' }
])


</script>

<style scoped>
.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
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

