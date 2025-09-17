<script setup lang="ts">
import { ref, computed, onMounted, watchEffect } from 'vue'

definePageMeta({ layout: 'default' })

// Props venant du layout pour le thème
defineProps<{
  mainClass: string,
  textClass: string,
  hoverClass: string
}>()

// --- Données & état ---
const allDemandes = ref<any[]>([])
const loading = ref(false)      // Chargement global
const tableLoading = ref(false) // Spinner spécifique tableau
const error = ref('')

// Statistiques brutes
const stats = ref({
  totalCandidatures: 0,
  candidaturesAcceptees: 0,
  candidaturesRefusees: 0,
  candidaturesEnAttente: 0
})

// Statistiques animées
const animatedStats = ref({
  totalCandidatures: 0,
  candidaturesAcceptees: 0,
  candidaturesRefusees: 0,
  candidaturesEnAttente: 0
})

// --- Theme ---
const theme = ref('light')
onMounted(() => {
  if (typeof window !== 'undefined') {
    theme.value = localStorage.getItem('theme') || 'light'
  }
})

// --- Récupération depuis l'API ---
const fetchDemandes = async () => {
  loading.value = true
  tableLoading.value = true
  error.value = ''
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    const response = await fetch('https://digit-cursus-backend.onrender.com/api/demandes/internships', {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      }
    })
    if (!response.ok) throw new Error('Erreur lors de la récupération des demandes')
    const data = await response.json()

    allDemandes.value = data.map((d: any) => ({
      domaine: d.domain || 'Non précisé',
      typeStage: d.request_type === 'academic' ? 'Scolaire' : 'Professionnel',
      duree: parseInt(d.duration),
      dateDebut: d.start_date,
      statut: d.status === 'pending'
        ? 'En attente'
        : d.status === 'approved'
        ? 'Accepté'
        : d.status === 'rejected'
        ? 'Refusé'
        : d.status,
      lettre: d.recommendation_letter || ''
    }))

    // Mettre à jour les statistiques brutes
    stats.value.totalCandidatures = allDemandes.value.length
    stats.value.candidaturesAcceptees = allDemandes.value.filter(d => d.statut === 'Accepté').length
    stats.value.candidaturesRefusees = allDemandes.value.filter(d => d.statut === 'Refusé').length
    stats.value.candidaturesEnAttente = allDemandes.value.filter(d => d.statut === 'En attente').length
  } catch (err: any) {
    error.value = err.message || 'Erreur inconnue'
  } finally {
    loading.value = false
    tableLoading.value = false
  }
}

onMounted(fetchDemandes)

// --- Animation des statistiques ---
function animateStat(key: string, value: number, duration = 2000) {
  const stepTime = 50
  const steps = Math.ceil(duration / stepTime)
  let current = 0
  const increment = value / steps
  const interval = setInterval(() => {
    current += increment
    animatedStats.value[key] = Math.ceil(current)
    if (current >= value) {
      animatedStats.value[key] = value
      clearInterval(interval)
    }
  }, stepTime)
}

watchEffect(() => {
  animateStat('totalCandidatures', stats.value.totalCandidatures)
  animateStat('candidaturesAcceptees', stats.value.candidaturesAcceptees)
  animateStat('candidaturesRefusees', stats.value.candidaturesRefusees)
  animateStat('candidaturesEnAttente', stats.value.candidaturesEnAttente)
})

// --- Statut dynamique ---
const today = new Date()
const getStatutActuel = (demande: any) => {
  const debut = new Date(demande.dateDebut)
  const fin = new Date(debut)
  fin.setMonth(fin.getMonth() + demande.duree)

  if (demande.statut === 'Refusé') return 'Refusé'
  if (demande.statut === 'En attente') return 'En attente'
  if (today < debut) return 'Accepté'
  if (today >= debut && today <= fin) return 'En cours'
  if (today > fin) return 'Terminé'
  return 'Inconnu'
}

// Couleurs adaptatives pour les statuts
function statusColor(statut: string) {
  switch (statut) {
    case 'Accepté': return 'bg-[#1e7e34] text-white'
    case 'En cours': return 'bg-[#5a2fc4] text-white'
    case 'Révisé': return 'bg-[#5a2fc4] text-white'
    case 'Refusé': return 'bg-[#922026] text-white'
    case 'En attente': return 'bg-[#5a2fc4] text-white'
    default: return 'bg-[#5a2fc4] text-white'
  }
}

// --- Pagination & filtres ---
const statusFilters = ['Tous', 'En attente', 'Accepté', , 'Refusé']
const selectedFilter = ref('Tous')
const itemsPerPage = 5
const currentPage = ref(1)

const filteredDemandes = computed(() => {
  if (selectedFilter.value === 'Tous') return allDemandes.value
  return allDemandes.value.filter(d => getStatutActuel(d) === selectedFilter.value)
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredDemandes.value.length / itemsPerPage))
)

const paginatedDemandes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredDemandes.value.slice(start, start + itemsPerPage)
})

function changePage(page: number) {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page
}

function changeStatus(filter: string) {
  selectedFilter.value = filter
  currentPage.value = 1
}
</script>

<template>
<section :class="['min-h-screen  mt-20 px-6 py-8 max-w-6xl mx-auto', mainClass]">
  <!-- Header -->


  <!-- Loading / Erreur global -->
  <div v-if="loading" class="flex flex-col items-center justify-center py-10">
    <svg class="animate-spin h-12 w-12 mb-4 text-[#5a2fc4]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75 fill-[#5a2fc4]" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
    </svg>
  </div>

  <div v-else-if="error" class="flex flex-col items-center py-10">
    <p class="text-red-500 mb-4">{{ error }}</p>
    <button @click="fetchDemandes" class="px-4 py-2 rounded bg-[#5a2fc4] hover:bg-[#4a23a6] text-white">
      Recharger
    </button>
  </div>

<!-- Statistiques -->
<div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-10">
  <div class="p-6 rounded-lg shadow-sm dark:shadow-gray-800/80 text-center transition-colors transition-shadow ">
    <p class="text-4xl font-bold bg-gradient-to-r from-[#FF5F36] to-[#6E38E0] bg-clip-text text-transparent">
      {{ animatedStats.totalCandidatures }}
    </p>
    <p class="text-gray-400 mt-1">Stages totaux</p>
  </div>

  <div class="p-6 rounded-lg shadow-sm dark:shadow-gray-800/80 text-center transition-colors transition-shadow ">
    <p class="text-4xl font-bold bg-gradient-to-r from-[#FF5F36] to-[#6E38E0] bg-clip-text text-transparent">
      {{ animatedStats.candidaturesEnAttente }}
    </p>
    <p class="text-gray-400 mt-1">Stages en attente</p>
  </div>

 
</div>

<h1 class="text-2xl mb-8">Mes demandes</h1>
  <!-- Bande de filtres horizontale -->
    <div class="relative mb-6 border-b border-gray-700 overflow-x-auto no-scrollbar">
      <div class="flex gap-6 w-max px-2">
        <div
          v-for="filter in statusFilters"
          :key="filter"
          @click="changeStatus(filter)"
          class="relative cursor-pointer py-2 px-4 transition-all duration-200 ease-in-out whitespace-nowrap rounded-full
                 hover:bg-gradient-to-r hover:from-[#FF5F36] hover:to-[#6E38E0] hover:text-white"
          :class="selectedFilter === filter ? 'bg-gradient-to-r from-[#FF5F36] to-[#6E38E0] text-white font-semibold' : textClass"
        >
          {{ filter }}
          <span
            class="absolute left-0 -bottom-[1px] h-[2px] w-full bg-[#FF5F36] transition-opacity duration-200"
            :class="selectedFilter === filter ? 'opacity-100' : 'opacity-0'"
          ></span>
        </div>
      </div>
    </div>


  <!-- Tableau -->
  <div class="p-4 rounded-lg shadow-md transition-colors bg-[#5a2fc4]/10">
    <div class="flex justify-end mb-5">
      <NuxtLink to="/dashboard/demande-stage" class="bg-gradient-to-r from-[#FF5F36] to-[#6E38E0] hover:bg-[#4a23a6] px-4 py-2 rounded text-white">
        Faire une demande
      </NuxtLink>
    </div>

    <div class="relative overflow-x-auto">
      <!-- Spinner tableau -->
      <div v-if="tableLoading" class="flex justify-center items-center py-20 bg-white/70 dark:bg-black/50">
        <svg class="animate-spin h-10 w-10 text-[#5a2fc4]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75 fill-[#5a2fc4]" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
      </div>
      <!-- Tableau -->
      <table class="w-full border rounded-lg" v-show="!tableLoading">
        <thead class="bg-gradient-to-r from-[#FF5F36] to-[#6E38E0] text-white">
          <tr>
            <th class="px-4 py-3 text-left">Domaine</th>
            <th class="px-4 py-3 text-left">Type</th>
            <th class="px-4 py-3 text-left">Durée</th>
            <th class="px-4 py-3 text-left">Début</th>
            <th class="px-4 py-3 text-left">Lettre</th>
            <th class="px-4 py-3 text-left">Statut</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(demande, index) in paginatedDemandes" :key="index" :class="hoverClass">
            <td class="px-4 py-2" :class="textClass">{{ demande.domaine }}</td>
            <td class="px-4 py-2" :class="textClass">{{ demande.typeStage }}</td>
            <td class="px-4 py-2" :class="textClass">{{ demande.duree }} mois</td>
            <td class="px-4 py-2" :class="textClass">{{ demande.dateDebut }}</td>
            <td class="px-4 py-2">
              <a v-if="demande.lettre" :href="demande.lettre" target="_blank" download
                 class="bg-gradient-to-r from-[#FF5F36] to-[#6E38E0]  text-white px-3 py-1 rounded text-sm">
                Voir
              </a>
              <span v-else class="text-gray-400 text-sm">Aucune</span>
            </td>
            <td class="px-4 py-2">
              <span :class="['px-2 py-1 rounded text-sm', statusColor(getStatutActuel(demande))]">
                {{ getStatutActuel(demande) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="mt-6 flex justify-center gap-2">
      <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
        class="px-3 py-1 rounded bg-gradient-to-r from-[#FF5F36] to-[#6E38E0] text-white disabled:opacity-30">Précédent</button>
      <button v-for="page in totalPages" :key="page" @click="changePage(page)"
        :class="[currentPage === page 
          ? 'bg-gradient-to-r from-[#FF5F36] to-[#6E38E0] text-white' 
          : 'bg-gray-700 text-gray-300 hover:bg-[#5a2fc4]', 
          'px-3 py-1 rounded']">
        {{ page }}
      </button>
      <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
        class="px-3 py-1 rounded bg-gradient-to-r from-[#FF5F36] to-[#6E38E0] text-white disabled:opacity-30">Suivant</button>
    </div>
  </div>
</section>
</template>
