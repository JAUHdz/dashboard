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
            <ion-card>
              <ion-card-header>
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
      <ion-button expand="block" color="primary">Mostrar Empleados</ion-button>

      <!-- Mapa -->
      <div id="map" style="height: 400px; margin: 20px 0;"></div>

      <!-- Alertas Recientes -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>Alertas Recientes</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <p>No hay alertas recientes.</p>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { onMounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const cards = [
  { title: 'Empleados Activos', value: 0 },
  { title: 'Eventos Hoy', value: 0 },
  { title: 'Alertas Activas', value: 0 },
  { title: 'Estrés Promedio de los Empleados', value: '0%' }
]

onMounted(() => {
  const map = L.map('map').setView([23.6345, -102.5528], 5) // México

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)
})
</script>

<style scoped>
h2 {
  font-size: 24px;
  margin: 0;
  color: #333;
}
</style>
