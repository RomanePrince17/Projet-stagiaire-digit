<template>
  <section :class="['min-h-screen mt-20 px-4 sm:px-6 py-8 max-w-7xl mx-auto', mainClass]">
    <!-- Titre -->
    <div :class="['text-2xl font-bold mb-6', textClass]">
      Mes demandes de stages
    </div>

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

    <!-- Bouton nouvelle demande -->
    <div class="flex justify-end mb-4">
      <NuxtLink
        to="/dashboard/demande-stage"
        class="px-4 py-2 rounded text-sm text-white bg-gradient-to-r from-[#FF5F36] to-[#6E38E0]
               hover:from-[#FF704D] hover:to-[#7B49E5] transition-all duration-200"
      >
        Faire une demande
      </NuxtLink>
    </div>

    <!-- Loading & erreurs -->
    <div v-if="loading" class="flex justify-center items-center my-10">
      <svg
        class="animate-spin h-10 w-10"
        :class="theme === 'dark' ? 'text-white' : 'text-[#FF5F36]'"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          :class="theme === 'dark' ? 'fill-white' : 'fill-[#FF5F36]'"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
    </div>
    <div v-if="error" class="text-red-400 text-center my-10">{{ error }}</div>

    <!-- Tableau -->
    <div v-if="!loading && !error" class="overflow-x-auto rounded-lg shadow-md">
      <table class="min-w-[700px] w-full border rounded-lg text-sm sm:text-base border-gray-300 dark:border-gray-600">
        <thead class="transition-colors bg-gradient-to-r from-[#FF5F36] to-[#6E38E0] text-white">
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
          <tr
            v-for="(demande, index) in paginatedDemandes"
            :key="index"
            :class="hoverClass"
          >
            <td class="px-4 py-2" :class="textClass">{{ demande.domaine }}</td>
            <td class="px-4 py-2" :class="textClass">{{ demande.typeStage }}</td>
            <td class="px-4 py-2" :class="textClass">{{ demande.duree }} mois</td>
            <td class="px-4 py-2" :class="textClass">{{ demande.dateDebut }}</td>
            <td class="px-4 py-2" :class="textClass">
              <a
                v-if="demande.lettre"
                :href="demande.lettre"
                target="_blank"
                class="px-3 py-1 rounded text-sm text-white bg-gradient-to-r from-[#FF5F36] to-[#6E38E0]
                       hover:from-[#FF704D] hover:to-[#7B49E5] transition-all duration-200"
                download
              >
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
    <div v-if="!loading && !error" class="mt-6 flex flex-wrap justify-center gap-2">
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-3 py-1 rounded disabled:opacity-30 text-white bg-gradient-to-r from-[#FF5F36] to-[#6E38E0]
               hover:from-[#FF704D] hover:to-[#7B49E5] transition-all duration-200"
      >
        Précédent
      </button>
      <button
        v-for="page in totalPages"
        :key="page"
        @click="changePage(page)"
        :class="[ 
          'px-3 py-1 rounded',
          currentPage === page
            ? 'bg-gradient-to-r from-[#FF5F36] to-[#6E38E0] text-white'
            : ['border border-gray-300 dark:border-gray-600', textClass, hoverClass]
        ]"
      >
        {{ page }}
      </button>
      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-3 py-1 rounded disabled:opacity-30 text-white bg-gradient-to-r from-[#FF5F36] to-[#6E38E0]
               hover:from-[#FF704D] hover:to-[#7B49E5] transition-all duration-200"
      >
        Suivant
      </button>
    </div>
  </section>
</template>


<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Props pour thème
const props = defineProps<{ mainClass: string; textClass: string; hoverClass: string }>()
const mainClass = props.mainClass
const textClass = props.textClass
const hoverClass = props.hoverClass

// Données
const allDemandes = ref<any[]>([])
const loading = ref(false)
const error = ref('')

// Thème
const theme = ref('light')
onMounted(() => {
  if (typeof window !== 'undefined') {
    theme.value = localStorage.getItem('theme') || 'light'
  }
})

// Récupération API
const fetchDemandes = async () => {
  loading.value = true
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
      statut: d.status === 'pending' ? 'En attente' : d.status === 'approved' ? 'Accepté' : d.status === 'rejected' ? 'Refusé' : d.status,
      lettre: d.recommendation_letter || ''
    }))
  } catch (err: any) {
    error.value = err.message || 'Erreur inconnue'
  } finally {
    loading.value = false
  }
}
onMounted(fetchDemandes)

// Statut dynamique
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

// Couleurs pour statuts
function statusColor(statut: string) {
  switch (statut) {
    case 'Accepté': return 'bg-[#5a2fc4] text-white'
    case 'En cours': return 'bg-[#5a2fc4] text-white'
    case 'Terminé': return 'bg-[#5a2fc4] text-white'
    case 'En attente': return 'bg-[#5a2fc4] text-white'
    case 'Refusé': return 'bg-red-500 text-white'
    default: return 'bg-gray-500 text-white'
  }
}

// Pagination & filtres
const itemsPerPage = 5
const currentPage = ref(1)

const statusFilters = ['Tous', 'En attente', 'Accepté', 'En cours', 'Terminé', 'Refusé']
const selectedFilter = ref('Tous')

const filteredDemandes = computed(() => {
  if (selectedFilter.value === 'Tous') return allDemandes.value
  return allDemandes.value.filter(d => getStatutActuel(d) === selectedFilter.value)
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredDemandes.value.length / itemsPerPage)))

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
