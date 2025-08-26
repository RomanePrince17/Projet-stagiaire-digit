<script setup>
import { ref, onMounted } from 'vue'
import { Bar, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'

// Enregistrement des composants Chart.js
ChartJS.register(Title, Tooltip, Legend, BarElement, ArcElement, CategoryScale, LinearScale)
definePageMeta({
  layout: 'mylayout'
})
// Statistiques simulées (remplace par API)
const stats = ref({
  totalCandidatures: 45,
  candidaturesAcceptees: 12,
  candidaturesRefusees: 20,
  candidaturesEnAttente: 13,
  totalOffres: 10,
  offresPubliees: 7,
  offresBrouillons: 3,
})
// Données pour le graphique barres (offres vs candidatures)
const barData = ref({
  labels: ['Offres publiées', 'Offres brouillons'],
  datasets: [
    {
      label: 'Offres',
      backgroundColor: ['#3b82f6', '#9ca3af'],
      data: [stats.value.offresPubliees, stats.value.offresBrouillons],
    },
  ],
})
// 📄 Données simulées
const allDemandes = ref([
  {
    nom: 'Jean Dupont',
    photo: '/photos/jean.jpg',
    domaine: 'UI/UX Designer',
    typeStage: 'Professionnel',
    duree: 3,
    dateDebut: '2025-08-01',
    statut: 'Accepté',
    lettre: '/lettres/lettre-jean.pdf'
  },
  {
    nom: 'Alice Martin',
    photo: '/photos/alice.jpg',
    domaine: 'Frontend Developer',
    typeStage: 'Scolaire',
    duree: 2,
    dateDebut: '2025-09-15',
    statut: 'En attente',
    lettre: '/lettres/lettre-alice.pdf'
  },
  {
    nom: 'Karim El Amrani',
    photo: '/photos/karim.jpg',
    domaine: 'Data Analyst',
    typeStage: 'Professionnel',
    duree: 6,
    dateDebut: '2025-07-01',
    statut: 'Refusé',
    lettre: '/lettres/lettre-karim.pdf'
  },
  {
    nom: 'Léa Dubois',
    photo: '/photos/lea.jpg',
    domaine: 'Backend Developer',
    typeStage: 'Professionnel',
    duree: 4,
    dateDebut: '2025-10-01',
    statut: 'Accepté',
    lettre: '/lettres/lettre-lea.pdf'
  },
  {
    nom: 'Dylan Moreau',
    photo: '/photos/dylan.jpg',
    domaine: 'DevOps',
    typeStage: 'Scolaire',
    duree: 3,
    dateDebut: '2025-11-10',
    statut: 'En attente',
    lettre: '/lettres/lettre-dylan.pdf'
  },
  {
    nom: 'Nora Benali',
    photo: '/photos/nora.jpg',
    domaine: 'QA Engineer',
    typeStage: 'Scolaire',
    duree: 2,
    dateDebut: '2025-09-01',
    statut: 'Refusé',
    lettre: '/lettres/lettre-nora.pdf'
  },
  {
    nom: 'Khadija El Idrissi',
    photo: '/photos/khadija.jpg',
    domaine: 'Mobile Developer',
    typeStage: 'Professionnel',
    duree: 5,
    dateDebut: '2025-12-01',
    statut: 'En attente',
    lettre: '/lettres/lettre-khadija.pdf'
  }
])


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

const statusColors = {
  'Accepté': 'bg-green-500',
  'En attente': 'bg-yellow-500',
  'En cours': 'bg-blue-500',
  'Terminé': 'bg-gray-500',
  'Refusé': 'bg-red-500',
  'Inconnu': 'bg-gray-600'
}
const statusColor = (status) => statusColors[status] || 'bg-gray-600'

// 🔍 Filtres & Pagination
const selectedFilter = ref('Tous')
const itemsPerPage = 5
const currentPage = ref(1)

const filteredDemandes = computed(() => {
  if (selectedFilter.value === 'Tous') return allDemandes.value

  const statutFilters = ['En attente', 'Accepté', 'En cours', 'Terminé', 'Refusé']
  if (statutFilters.includes(selectedFilter.value)) {
    return allDemandes.value.filter(d => getStatutActuel(d) === selectedFilter.value)
  }

  return allDemandes.value.filter(d => d.typeStage === selectedFilter.value)
})

const totalPages = computed(() => Math.ceil(filteredDemandes.value.length / itemsPerPage))
const paginatedDemandes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredDemandes.value.slice(start, start + itemsPerPage)
})

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page
}

// 💡 Vérifie s'il y a des actions possibles pour afficher la colonne
const hasAnyActions = computed(() =>
  paginatedDemandes.value.some((demande) => getStatutActuel(demande) !== 'En cours')
)

// 🎯 Action handlers
const handleAction = (type, demande) => {
  switch (type) {
    case 'accepter':
      demande.statut = 'Accepté'
      break
    case 'refuser':
      demande.statut = 'Refusé'
      break
    case 'reviser':
      const message = prompt(`Entrez un message de révision pour "${demande.domaine}" :`)
      if (message) {
        // Simulation d'envoi d'email
        console.log(`📩 Mail envoyé pour révision : ${message}`)
        alert('Message de révision envoyé.')
      }
      break
  }
}
</script>

<template>
  <section class="min-h-screen bg-[#0f0f12] text-gray-100 px-6 py-8 max-w-6xl mx-auto">
    <header class="mb-8">
      <h1 class="text-3xl font-semibold">Statistiques</h1>
      <p class="text-gray-400 mt-1">Visualisez les performances de vos offres et candidatures.</p>
    </header>

    <!-- Cartes de synthèse -->
    <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6 mb-10">
       <div class="bg-[#15151b] p-6 rounded-lg shadow-md text-center">
        <p class="text-4xl font-bold text-yellow-400">{{ stats.candidaturesEnAttente }}</p>
        <p class="text-gray-300 mt-1">En attente</p>
      </div>
      <div class="bg-[#15151b] p-6 rounded-lg shadow-md text-center">
        <p class="text-4xl font-bold text-green-400">{{ stats.candidaturesAcceptees }}</p>
        <p class="text-gray-300 mt-1">Candidatures acceptées</p>
      </div>
      <div class="bg-[#15151b] p-6 rounded-lg shadow-md text-center">
        <p class="text-4xl font-bold text-red-400">{{ stats.candidaturesRefusees }}</p>
        <p class="text-gray-300 mt-1">Candidatures refusées</p>
      </div>
    </div>
    <div class="text-2xl mb-6">Demandes recues</div>
    

    <!-- Tableau -->
    <!-- 🧭 Filtre -->
    <div class="mb-6 flex flex-wrap gap-4 items-center">
      <button
        v-for="filter in ['Tous', 'En attente', 'Accepté', 'En cours', 'Terminé', 'Professionnel', 'Scolaire']"
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
    <!-- 📋 Tableau -->
    <div class="bg-[#15151b] p-4 rounded-lg shadow-md">
      <div class="overflow-x-auto">
        <table class="w-full border border-gray-700 rounded-lg">
          <thead class="bg-[#1F2937]">
            <tr>
              <th class="px-4 py-3 text-left">Profile</th>
              <th class="px-4 py-3 text-left">Domaine</th>
              <th class="px-4 py-3 text-left">Type</th>
              <th class="px-4 py-3 text-left">Durée</th>
              <th class="px-4 py-3 text-left">Début</th>
              <th class="px-4 py-3 text-left">Lettre</th>
              <th class="px-4 py-3 text-left">Statut</th>
              <th v-if="hasAnyActions" class="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(demande, index) in paginatedDemandes"
              :key="index"
              class="hover:bg-[#2d2d33]"
            >
            <td class="px-4 py-2 flex gap-3">
              <img :src="demande.photo" alt="Photo" class="w-10 h-10 rounded-full object-cover" />
              <span>{{ demande.nom }}</span>
            </td>
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
                  Voir 
                </a>
              </td>
              <td class="px-4 py-2">
                <span :class="['px-2 py-1 rounded text-white text-sm', statusColor(getStatutActuel(demande))]">
                  {{ getStatutActuel(demande) }}
                </span>
              </td>
              <td v-if="hasAnyActions" class="px-4 py-2">
                  <div class="flex gap-2 flex-wrap md:flex-nowrap sm:flex-nowrap">
                <template v-if="getStatutActuel(demande) !== 'En cours'">
                  <button
                    v-if="['En attente', 'Refusé'].includes(getStatutActuel(demande))"
                    class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                    @click="handleAction('accepter', demande)"
                  >
                    Accepter
                  </button>
                  <button
                    v-if="['En attente', 'Accepté', 'Terminé'].includes(getStatutActuel(demande))"
                    class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                    @click="handleAction('refuser', demande)"
                  >
                    Refuser
                  </button>

                  <button
                    v-if="['Accepté', 'Refusé', 'Terminé'].includes(getStatutActuel(demande))"
                    class="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                    @click="handleAction('reviser', demande)"
                  >
                    Réviser
                  </button>
                </template>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 📚 Pagination -->
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

<style scoped>
/* Optionnel: ajustements visuels */
</style>

