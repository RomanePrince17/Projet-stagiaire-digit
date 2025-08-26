<script setup>
import { ref, computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

definePageMeta({ layout: 'default' })

// 📊 Statistiques globales
const stats = ref({
  totalCandidatures: 3,
  candidaturesAcceptees: 1,
  candidaturesRefusees: 7,
  candidaturesEnAttente: 2
})

// 📄 Données des demandes
const allDemandes = ref([
  { domaine: 'UI/UX Designer', typeStage: 'Professionnel', duree: 3, dateDebut: '2025-08-01', statut: 'Accepté', lettre: '/lettres/lettre-jean.pdf' },
  { domaine: 'Frontend Developer', typeStage: 'Scolaire', duree: 2, dateDebut: '2025-09-15', statut: 'En attente', lettre: '/lettres/lettre-alice.pdf' },
  { domaine: 'Data Analyst', typeStage: 'Professionnel', duree: 6, dateDebut: '2025-07-01', statut: 'Refusé', lettre: '/lettres/lettre-karim.pdf' },
  { domaine: 'Backend Developer', typeStage: 'Professionnel', duree: 4, dateDebut: '2025-10-01', statut: 'Accepté', lettre: '/lettres/lettre-lea.pdf' },
  { domaine: 'DevOps', typeStage: 'Scolaire', duree: 3, dateDebut: '2025-11-10', statut: 'En attente', lettre: '/lettres/lettre-dylan.pdf' },
  { domaine: 'QA Engineer', typeStage: 'Scolaire', duree: 2, dateDebut: '2025-09-01', statut: 'Refusé', lettre: '/lettres/lettre-nora.pdf' },
  { domaine: 'Mobile Developer', typeStage: 'Professionnel', duree: 5, dateDebut: '2025-12-01', statut: 'En attente', lettre: '/lettres/lettre-khadija.pdf' }
])

// 📅 Statut calculé dynamiquement
const today = new Date()
const getStatutActuel = (demande) => {
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

// 🎨 Couleur par statut
const statusColor = (status) => {
  switch (status) {
    case 'Accepté': return 'bg-green-500'
    case 'En attente': return 'bg-yellow-500'
    case 'En cours': return 'bg-blue-500'
    case 'Terminé': return 'bg-gray-500'
    case 'Refusé': return 'bg-red-500'
    default: return 'bg-gray-600'
  }
}

// 🔍 Filtres & Pagination
const selectedFilter = ref('Tous')
const itemsPerPage = 5
const currentPage = ref(1)

const filteredDemandes = computed(() => {
  if (selectedFilter.value === 'Tous') return allDemandes.value
  return allDemandes.value.filter(d => getStatutActuel(d) === selectedFilter.value)
})

const totalPages = computed(() => Math.ceil(filteredDemandes.value.length / itemsPerPage))

const paginatedDemandes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredDemandes.value.slice(start, start + itemsPerPage)
})

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page
}
</script>

<template>
  <section class="min-h-screen bg-[#0f0f12] text-gray-100 px-6 py-8 max-w-6xl mx-auto">
    <div class="text-2xl mb-6">Mes demandes de stages</div>
    <!-- Filtres -->
    <div class="mb-4 flex flex-wrap gap-3 items-center">
      <button
        v-for="filter in ['Tous', 'En attente', 'Accepté', 'En cours', 'Terminé']"
        :key="filter"
        @click="selectedFilter = filter; currentPage = 1"
        :class="[
          'px-4 py-2 rounded text-sm',
          selectedFilter === filter ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        ]"
      >
        {{ filter }}
      </button>
    </div>

    <!-- Tableau -->
    <div class="bg-[#15151b] p-3 rounded-lg shadow-md">
      <NuxtLink  to="/dashboard/demande-stage" class="mb-5  bg-pink-600 hover:bg-pink-700 px-4 py-2  rounded text-white">Faire une demande</NuxtLink>
      <div class="overflow-x-auto">
        <table class="w-full border border-gray-700 rounded-lg">
          <thead class="bg-[#1F2937]">
            <tr>
              <th class="px-4 py-3 text-left">Domaine</th>
              <th class="px-4 py-3 text-left">Type</th>
              <th class="px-4 py-3 text-left">Durée</th>
              <th class="px-4 py-3 text-left">Début</th>
              <th class="px-4 py-3 text-left">Lettre</th>
              <th class="px-4 py-3 text-left">Statut</th>
              <th class="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(demande, index) in paginatedDemandes"
              :key="index"
              class="hover:bg-[#374151]"
            >
              <td class="px-4 py-2">{{ demande.domaine }}</td>
              <td class="px-4 py-2">{{ demande.typeStage }}</td>
              <td class="px-4 py-2">{{ demande.duree }} mois</td>
              <td class="px-4 py-2">{{ demande.dateDebut }}</td>
              <td class="px-4 py-2">
                <a
                  :href="demande.lettre"
                  target="_blank"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                  download
                >
                  Voir la lettre
                </a>
              </td>
              <td class="px-4 py-2">
                <span :class="['px-2 py-1 rounded text-white text-sm', statusColor(getStatutActuel(demande))]">
                  {{ getStatutActuel(demande) }}
                </span>
              </td>
              <td class="px-4 py-2 flex gap-2">
                <button
                  v-if="['En attente', 'Accepté', 'En cours', 'Terminé', 'Refusé'].includes(getStatutActuel(demande))"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                >
                  Voir
                </button>
                <button
                  v-if="getStatutActuel(demande) === 'En attente'"
                  class="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                >
                  Modifier
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="mt-6 flex justify-center gap-2">
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-1 rounded bg-gray-600 text-white disabled:opacity-30"
        >
          Précédent
        </button>
        <button
          v-for="page in totalPages"
          :key="page"
          @click="changePage(page)"
          :class="[
            'px-3 py-1 rounded',
            currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          ]"
        >
          {{ page }}
        </button>
        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 rounded bg-gray-600 text-white disabled:opacity-30"
        >
          Suivant
        </button>
      </div>
    </div>
  </section>
</template>
