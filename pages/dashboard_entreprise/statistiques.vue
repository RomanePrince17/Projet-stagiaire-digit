<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { CheckIcon, XMarkIcon, PencilSquareIcon } from '@heroicons/vue/24/outline'

definePageMeta({ ssr: false, layout: 'mylayout' })

// Props venant du layout
defineProps<{
  mainClass: string,
  textClass: string,
  hoverClass: string
}>()

// --- Données & état ---
const allDemandes = ref<any[]>([])
const loading = ref(true)      // Chargement global
const tableLoading = ref(false)
const error = ref('')
const token = ref(null)

// --- Statistiques ---
const stats = ref({
  totalCandidatures: 0,
  candidaturesAcceptees: 0,
  candidaturesRefusees: 0,
  candidaturesEnAttente: 0
})
const animatedStats = ref({ ...stats.value })

// --- Modals / Feedback ---
const confirmationModal = ref({ visible: false, title: '', message: '', action: null, demande: null })
const revisionModal = ref({ visible: false, demande: null, duration: '', startDate: '' })
const feedbackModal = ref({ visible: false, message: '', type: 'success' })

function showFeedback(message: string, type: string = 'success') {
  feedbackModal.value = { visible: true, message, type }
  setTimeout(() => { feedbackModal.value.visible = false }, 3000)
}

function confirmAction(type: string, demande: any) {
  confirmationModal.value = {
    visible: true,
    title: `Confirmer l'action`,
    message: `Êtes-vous sûr de vouloir ${type === 'accepter' ? 'accepter' : type === 'refuser' ? 'refuser' : 'réviser'} la demande de "${demande.nom}" ?`,
    action: type,
    demande
  }
}

async function executeConfirmedAction() {
  const { action, demande } = confirmationModal.value
  confirmationModal.value.visible = false
  await handleAction(action, demande)
}

// --- Filtres & pagination ---
const statusFilters = ['Tous', 'En attente', 'Accepté', 'Refusé', 'Révisé']
const selectedFilter = ref('Tous')
const itemsPerPage = 5
const currentPage = ref(1)

function changePage(page: number) {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page
}

function changeStatus(filter: string) {
  selectedFilter.value = filter
  currentPage.value = 1
}

const filteredDemandes = computed(() => {
  if (selectedFilter.value === 'Tous') return allDemandes.value
  return allDemandes.value.filter(d => d.statut === selectedFilter.value)
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredDemandes.value.length / itemsPerPage)))

const paginatedDemandes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredDemandes.value.slice(start, start + itemsPerPage)
})

// --- Statut dynamique et couleurs ---
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

function statusColor(statut: string) {
  switch (statut) {
    case 'Accepté': return 'bg-[#1e7e34] text-white'
    case 'En cours': return 'bg-[#5a2fc4] text-white'
    case 'Révisé': return 'bg-[#b58500] text-white'
    case 'Refusé': return 'bg-[#922026] text-white'
    case 'En attente': return 'bg-[#5a2fc4] text-white'
    default: return 'bg-gray-500 text-white'
  }
}

// --- Actions ---
async function handleAction(type: string, demande: any) {
  if (demande.status && demande.status !== 'pending') return
  demande.processingType = type

  if (type === 'reviser') {
    revisionModal.value = { visible: true, demande, duration: demande.duree, startDate: demande.dateDebut }
    return
  }

  const action = type === 'accepter' ? 'accept' : type === 'refuser' ? 'reject' : null
  if (!action) return

  try {
    const res = await fetch(`https://digit-cursus-backend.onrender.com/api/demandes/internship-requests/${demande.id}/approve-reject/`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token.value}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ action })
    })
    if (!res.ok) throw new Error(`Erreur: ${res.status}`)
    demande.statut = action === 'accept' ? 'Accepté' : 'Refusé'
    showFeedback(`Demande ${action === 'accept' ? 'acceptée' : 'refusée'} avec succès.`)
  } catch (err: any) {
    showFeedback(`Erreur lors de la mise à jour: ${err.message}`, 'error')
  } finally {
    delete demande.processingType
  }
}

// --- Fetch API ---
onMounted(async () => {
  try {
    token.value = localStorage.getItem('auth_token')
    if (!token.value) throw new Error('Token non trouvé')

    const res = await fetch('https://digit-cursus-backend.onrender.com/api/demandes/internships', {
      headers: { 'Authorization': `Bearer ${token.value}`, 'Content-Type': 'application/json' }
    })
    if (!res.ok) throw new Error('Erreur lors de la récupération des demandes')

    const data = await res.json()
    allDemandes.value = data.map((d: any) => ({
      id: d.id,
      nom: `${d.profile_personal?.first_name || ''} ${d.profile_personal?.last_name || ''}`.trim() || `Utilisateur #${d.id}`,
      domaine: d.domain || 'Non précisé',
      typeStage: d.request_type === 'academic' ? 'Scolaire' : 'Professionnel',
      duree: parseInt(d.duration),
      dateDebut: d.start_date,
      lettre: d.recommendation_letter || '',
      statut: d.status === 'pending' ? 'En attente' : d.status === 'approved' ? 'Accepté' : d.status === 'rejected' ? 'Refusé' : d.status
    }))

    // Mettre à jour les stats
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
})

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

onMounted(() => {
  Object.keys(stats.value).forEach(k => animateStat(k, stats.value[k as keyof typeof stats.value]))
})
</script>

<template>
<section :class="['min-h-screen mt-20 px-6 max-w-6xl mx-auto', mainClass]">



  <!-- Loading / Erreur global -->
  <div v-if="loading" class="flex flex-col  items-center justify-center py-10">
    <svg class="animate-spin h-12 w-12 mb-4 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75 fill-blue-700" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
    </svg>
  </div>
  <div v-else-if="error" class="flex flex-col items-center py-10">
    <p class="text-red-500 mb-4">{{ error }}</p>
    <button @click="fetchDemandes" class="px-4 py-2 rounded bg-blue-700 hover:bg-blue-700 text-white">
      Recharger
    </button>
  </div>

  <!-- Statistiques -->
  <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-10">
    <div class="p-6 rounded-lg shadow-sm text-center transition-colors">
      <p class="text-4xl font-bold bg-blue-700 bg-clip-text text-transparent">
        {{ animatedStats.totalCandidatures }}
      </p>
      <p class="text-gray-400 mt-1">Stages totaux</p>
    </div>
    <div class="p-6 rounded-lg shadow-sm text-center transition-colors">
      <p class="text-4xl font-bold bg-blue-700 bg-clip-text text-transparent">
        {{ animatedStats.candidaturesEnAttente }}
      </p>
      <p class="text-gray-400 mt-1">Stages en attente</p>
    </div>
  </div>

  <!-- Bande de filtres horizontale -->
      <!-- Filtres de statut -->
    <div class="relative mb-6 overflow-x-auto no-scrollbar">
      <div class="flex gap-6 w-max px-2">
        <div v-for="filter in statusFilters" :key="filter" @click="changeStatus(filter)"
             class="relative cursor-pointer py-2 px-4 transition-all duration-200 ease-in-out whitespace-nowrap rounded-full
                    hover:bg-blue-700 hover:text-white"
             :class="selectedStatus === filter ? 'bg-blue-700 text-white font-semibold' : textClass">
          {{ getFilterLabel(filter) }}
        </div>
      </div>
    
  </div>

  <!-- Tableau -->
  <div class="p-4 rounded-lg shadow-md transition-colors  bg-[#5a2fc4]/10">
    

    <div class="relative overflow-x-auto">
      <!-- Spinner tableau -->
      <div v-if="tableLoading" class="flex justify-center items-center py-20 bg-white/70 dark:bg-black/50">
        <svg class="animate-spin h-10 w-10 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75 fill-blue-700" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
      </div>
      <table class="w-full border rounded-lg" v-show="!tableLoading">
        <thead class="text-white">
          <tr>
            <th class="px-4 py-3 text-left">Nom</th>
            <th class="px-4 py-3 text-left">Domaine</th>
            <th class="px-4 py-3 text-left">Type</th>
            <th class="px-4 py-3 text-left">Durée</th>
            <th class="px-4 py-3 text-left">Début</th>
            <th class="px-4 py-3 text-left">Lettre</th>
            <th class="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="demande in paginatedDemandes" :key="demande.id" :class="hoverClass">
            <td class="px-4 py-2" :class="textClass">{{ demande.nom }}</td>
            <td class="px-4 py-2" :class="textClass">{{ demande.domaine }}</td>
            <td class="px-4 py-2" :class="textClass">{{ demande.typeStage }}</td>
            <td class="px-4 py-2" :class="textClass">{{ demande.duree }} mois</td>
            <td class="px-4 py-2" :class="textClass">{{ demande.dateDebut }}</td>
            <td class="px-4 py-2">
              <a v-if="demande.lettre" :href="demande.lettre" target="_blank" download class="bg-blue-700 text-white px-3 py-1 rounded text-sm">
                Voir
              </a>
              <span v-else class="text-gray-400 text-sm">Aucune</span>
            </td>
            <td class="px-4 py-2 flex gap-2 flex-wrap">
              <button @click="confirmAction('accepter', demande)" class="p-2 rounded-full bg-[#1e7e34] flex items-center justify-center" :disabled="demande.processingType">
                <CheckIcon v-if="!demande.processingType" class="h-5 w-5 text-white"/>
                <svg v-else-if="demande.processingType === 'accepter'" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              </button>
              <button @click="confirmAction('refuser', demande)" class="p-2 rounded-full bg-[#922026] flex items-center justify-center" :disabled="demande.processingType">
                <XMarkIcon v-if="!demande.processingType" class="h-5 w-5 text-white"/>
                <svg v-else-if="demande.processingType === 'refuser'" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              </button>
              <button @click="confirmAction('reviser', demande)" class="p-2 rounded-full bg-[#b58500] flex items-center justify-center" :disabled="demande.processingType">
                <PencilSquareIcon v-if="!demande.processingType" class="h-5 w-5 text-white"/>
              </button>
            </td>
          </tr>

          <tr v-if="!paginatedDemandes.length">
            <td colspan="7" class="text-center py-6 text-gray-400">Aucune demande trouvée.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="mt-6 flex justify-center gap-2">
      <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="px-3 py-1 rounded bg-blue-700 text-white disabled:opacity-30">Précédent</button>
      <button v-for="page in totalPages" :key="page" @click="changePage(page)" :class="[currentPage === page ? 'bg-blue-700 text-white' : 'bg-gray-700 text-gray-300 hover:bg-[#5a2fc4]', 'px-3 py-1 rounded']">{{ page }}</button>
      <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="px-3 py-1 rounded bg-blue-700 text-white disabled:opacity-30">Suivant</button>
    </div>
  </div>
</section>
</template>
