<template>
  <section :class="['min-h-screen px-6 py-8 max-w-6xl mx-auto', mainClass]">

    <!-- Filtre par type -->
    <div class="mb-28">
      <select v-model="selectedType" @change="resetStatusOnTypeChange"
              class="bg-gray-500 text-white px-4 py-2 rounded">
        <option value="all">Tous</option>
        <option value="Scolaire">Académique</option>
        <option value="Professionnel">Professionnel</option>
      </select>
    </div>

    <!-- Filtres de statut -->
    <div class="relative mb-6 border-b border-gray-700 overflow-x-auto no-scrollbar">
      <div class="flex gap-6 w-max px-2">
        <div v-for="filter in statusFilters" :key="filter" @click="changeStatus(filter)"
             class="relative cursor-pointer py-2 px-4 transition-all duration-200 ease-in-out whitespace-nowrap rounded-full
                    hover:bg-[#6E38E0] hover:text-white"
             :class="selectedStatus === filter ? 'bg-[#6E38E0] text-white font-semibold' : textClass">
          {{ getFilterLabel(filter) }}
        </div>
      </div>
    </div>

    <!-- Tableau -->
    <div class="p-4 rounded-lg shadow-md transition-colors bg-[#5a2fc4]/10">

      <!-- Spinner loading -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-10">
        <svg class="animate-spin h-12 w-12 mb-4 text-[#5a2fc4]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75 fill-[#5a2fc4]" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
      </div>

      <table v-if="!loading" class="w-full border rounded-lg">
        <thead class="text-white">
          <tr>
            <th class="px-4 py-3 text-left">Nom</th>
            <th class="px-4 py-3 text-left">Domaine</th>
            <th class="px-4 py-3 text-left">Type</th>
            <th class="px-4 py-3 text-left">Durée</th>
            <th class="px-4 py-3 text-left">Début</th>
            <th class="px-4 py-3 text-left">Lettre</th>
            <th v-if="hasAnyActions" class="px-4 py-3 text-left">Actions</th>
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
              <a v-if="demande.lettre" :href="demande.lettre" target="_blank" download
                 class="bg-[#6E38E0] text-white px-3 py-1 rounded text-sm">Voir</a>
              <span v-else class="text-gray-400 text-sm">Aucune</span>
            </td>
            <td v-if="hasAnyActions" class="px-4 py-2 flex gap-2 flex-wrap">
              <button @click="handleAction('accepter', demande)" 
                      class="p-2 rounded-full bg-[#1e7e34] flex items-center justify-center"
                      :disabled="demande.processingType">
                <CheckIcon v-if="!demande.processingType" class="h-5 w-5 text-white"/>
                <svg v-else-if="demande.processingType === 'accepter'" class="animate-spin h-5 w-5 text-white" 
                     xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                </svg>
              </button>

              <button @click="handleAction('refuser', demande)" 
                      class="p-2 rounded-full bg-[#922026] flex items-center justify-center"
                      :disabled="demande.processingType">
                <XMarkIcon v-if="!demande.processingType" class="h-5 w-5 text-white"/>
                <svg v-else-if="demande.processingType === 'refuser'" class="animate-spin h-5 w-5 text-white" 
                     xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                </svg>
              </button>

              <button @click="handleAction('reviser', demande)" 
                      class="p-2 rounded-full bg-[#b58500] flex items-center justify-center"
                      :disabled="demande.processingType">
                <PencilSquareIcon v-if="!demande.processingType" class="h-5 w-5 text-white"/>
              </button>
            </td>
          </tr>

          <tr v-if="!paginatedDemandes.length">
            <td colspan="7" class="text-center py-6 text-gray-400">Aucune demande trouvée.</td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="mt-6 flex justify-center gap-2">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" 
                class="px-3 py-1 rounded bg-[#6E38E0] text-white disabled:opacity-30">Précédent</button>
        <button v-for="page in totalPages" :key="page" @click="changePage(page)"
                :class="[currentPage === page ? 'bg-[#6E38E0] text-white' : 'bg-gray-700 text-gray-300 hover:bg-[#5a2fc4]', 'px-3 py-1 rounded']">
          {{ page }}
        </button>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" 
                class="px-3 py-1 rounded bg-[#6E38E0] text-white disabled:opacity-30">Suivant</button>
      </div>
    </div>

    <!-- Modal Révision -->
    <div v-if="revisionModal.visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div class="bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h2 class="text-white text-lg font-semibold mb-4">Réviser la demande</h2>
        <label class="text-gray-200">Durée (mois)</label>
        <input v-model="revisionModal.duration" type="number" class="w-full mb-4 p-2 rounded text-black"/>
        <label class="text-gray-200">Date de début</label>
        <input v-model="revisionModal.startDate" type="date" class="w-full mb-4 p-2 rounded text-black"/>
        <div class="flex justify-end gap-2">
          <button @click="revisionModal.visible = false" class="px-4 py-2 bg-gray-600 rounded text-white">Annuler</button>
          <button @click="submitRevision" class="px-4 py-2 bg-[#b58500] rounded text-white">Valider</button>
        </div>
      </div>
    </div>

    <!-- Feedback Toast -->
    <div v-if="feedbackModal.visible"
         :class="['fixed top-6 right-6 px-4 py-2 rounded shadow-lg flex items-center gap-2 z-50',
                  feedbackModal.type === 'success' ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900']">
      <span>{{ feedbackModal.message }}</span>
      <button @click="feedbackModal.visible = false" class="font-bold">&times;</button>
    </div>

  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { CheckIcon, XMarkIcon, PencilSquareIcon } from '@heroicons/vue/24/outline'

definePageMeta({ ssr: false, layout: 'mylayout' })
defineProps<{
  mainClass: string,
  textClass: string,
  hoverClass: string
}>()

const allDemandes = ref<any[]>([])
const loading = ref(true)
const error = ref(null)
const token = ref(localStorage.getItem('auth_token') || null)

const selectedType = ref('all')
const selectedStatus = ref('pending')
const itemsPerPage = 5
const currentPage = ref(1)

const statusLabels = { pending: 'En attente', accepted: 'Accepté', rejected: 'Refusé', revised: 'Révisé' }
const statusFilters = ['pending', 'accepted', 'rejected', 'revised']

const revisionModal = ref({ visible: false, demande: null, duration: '', startDate: '' })
const feedbackModal = ref({ visible: false, message: '', type: 'success' })

function showFeedback(message: string, type: string = 'success') {
  feedbackModal.value = { visible: true, message, type }
  setTimeout(() => { feedbackModal.value.visible = false }, 3000)
}

function resetStatusOnTypeChange() {
  selectedStatus.value = 'pending'
  currentPage.value = 1
}

function changeStatus(newStatus: string) {
  selectedStatus.value = newStatus
  currentPage.value = 1
}

function changePage(page: number) {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page
}

const getFilterLabel = (status: string) => statusLabels[status] || status

const filteredDemandes = computed(() => {
  let filtered = allDemandes.value
  if (selectedType.value !== 'all') filtered = filtered.filter(d => d.typeStage === selectedType.value)
  if (selectedStatus.value !== 'all') filtered = filtered.filter(d => d.status === selectedStatus.value)
  return filtered
})

const totalPages = computed(() => Math.ceil(filteredDemandes.value.length / itemsPerPage))
const paginatedDemandes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredDemandes.value.slice(start, start + itemsPerPage)
})
const hasAnyActions = computed(() => paginatedDemandes.value.some(d => d.status === 'pending'))

async function handleAction(type: string, demande: any) {
  if (demande.status !== 'pending' || demande.processingType) return

  demande.processingType = type

  if (type === 'reviser') {
    revisionModal.value = { visible: true, demande, duration: demande.duree, startDate: demande.dateDebut }
    delete demande.processingType
    return
  }

  const action = type === 'accepter' ? 'accept' : type === 'refuser' ? 'reject' : null
  if (!action) return

  try {
    const res = await fetch(`https://digit-cursus-backend.onrender.com/api/demandes/internship-requests/${demande.id}/approve-reject/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action })
    })
    if (!res.ok) throw new Error(`Erreur: ${res.status}`)
    demande.status = action === 'accept' ? 'accepted' : 'rejected'
    showFeedback(`Demande ${action === 'accept' ? 'acceptée' : 'refusée'} avec succès.`)
  } catch (err: any) {
    showFeedback(`Erreur lors de la mise à jour: ${err.message}`, 'error')
  } finally {
    delete demande.processingType
  }
}

async function submitRevision() {
  const { demande, duration, startDate } = revisionModal.value
  demande.processingType = 'reviser'
  try {
    const res = await fetch(`https://digit-cursus-backend.onrender.com/api/demandes/internship-requests/${demande.id}/revise/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ revised_duration: `${duration} months`, revised_start_date: startDate })
    })
    if (!res.ok) throw new Error(`Erreur API: ${res.status}`)
    demande.status = 'revised'
    demande.duree = parseInt(duration)
    demande.dateDebut = startDate
    revisionModal.value.visible = false
    showFeedback('Demande révisée avec succès.', 'success')
  } catch (err: any) {
    showFeedback(`Erreur lors de la révision: ${err.message}`, 'error')
  } finally {
    delete demande.processingType
  }
}

onMounted(async () => {
  try {
    if (!token.value) throw new Error('Token non trouvé')
    const res = await fetch('https://digit-cursus-backend.onrender.com/api/demandes/admin/internships/', {
      headers: { 'Authorization': `Bearer ${token.value}`, 'Content-Type': 'application/json' }
    })
    if (!res.ok) throw new Error(`Erreur API: ${res.status}`)
    const data = await res.json()
    allDemandes.value = Array.isArray(data) ? data.map(item => ({
      id: item.id,
      nom: `${item.profile_personal?.first_name || ''} ${item.profile_personal?.last_name || ''}`.trim() || `Utilisateur #${item.id}`,
      domaine: item.domain_name || 'Non précisé',
      typeStage: item.request_type === 'academic' ? 'Scolaire' : 'Professionnel',
      duree: parseInt(item.duration),
      dateDebut: item.start_date,
      lettre: item.recommendation_letter || item.demand_letter || '#',
      status: item.status
    })) : []
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>
