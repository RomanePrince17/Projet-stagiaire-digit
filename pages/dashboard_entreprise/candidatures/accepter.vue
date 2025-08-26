<template>
  <div class="min-h-screen text-white p-6">
    <h1 class="text-2xl font-bold mb-6">Demandes de stage acceptées</h1>

    <!-- Filtres type de stage -->
    <div class="flex gap-6 border-b border-gray-700 mb-6">
      <button
        @click="filtrerType(null)"
        :class="['pb-2', typeSelectionne === null ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400 hover:text-white']"
      >
        Tous
      </button>
      <button
        @click="filtrerType('Scolaire')"
        :class="['pb-2', typeSelectionne === 'Scolaire' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400 hover:text-white']"
      >
        Académiques
      </button>
      <button
        @click="filtrerType('Professionnel')"
        :class="['pb-2', typeSelectionne === 'Professionnel' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400 hover:text-white']"
      >
        Professionnels
      </button>
    </div>

    <!-- Cartes -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="(demande, index) in demandesFiltrees"
        :key="index"
        class="bg-[#1F2937] rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
      >
        <img
          :src="demande.photo"
          :alt="demande.nom"
          class="w-full h-48 object-cover"
        />

        <div class="p-4">
          <h2 class="text-lg font-semibold mb-1">{{ demande.nom }}</h2>
          <p class="text-gray-400 text-sm mb-2">{{ demande.etablissement }}</p>

          <div class="text-sm space-y-1">
            <p><span class="font-medium">Niveau :</span> {{ demande.niveau }}</p>
            <p><span class="font-medium">Type :</span> {{ demande.typeStage }}</p>
            <p><span class="font-medium">Durée :</span> {{ demande.duree }} mois</p>
            <p><span class="font-medium">Début :</span> {{ demande.dateDebut }}</p>
            <p><span class="font-medium">Statut :</span>
              <span class="text-green-400">{{ demande.statut }}</span>
            </p>
          </div>

          <!-- Actions (uniquement voir pour les acceptés) -->
          <div class="mt-4 flex justify-center gap-4">
            <button
              class="bg-[#6E38E0] hover:bg-blue-700 text-white p-2 rounded flex justify-center"
              title="Voir"
            >
              <EyeIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { EyeIcon } from '@heroicons/vue/24/solid'

definePageMeta({
  layout: 'mylayout'
})

const typeSelectionne = ref(null)

const demandes = ref([
  {
    nom: 'Jean Doe',
    etablissement: 'Université XYZ',
    niveau: 'Troisième année',
    typeStage: 'Professionnel',
    duree: 3,
    dateDebut: '2025-08-01',
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
    statut: 'accepté'
  },
  {
    nom: 'Alice Smith',
    etablissement: 'Institut ABC',
    niveau: 'Deuxième année',
    typeStage: 'Scolaire',
    duree: 2,
    dateDebut: '2025-09-15',
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
    statut: 'accepté'
  },
  {
    nom: 'Paul Martin',
    etablissement: 'Université ABC',
    niveau: 'Troisième année',
    typeStage: 'Professionnel',
    duree: 3,
    dateDebut: '2025-08-10',
    photo: 'https://randomuser.me/api/portraits/men/75.jpg',
    statut: 'rejeté'
  }
])

const demandesFiltrees = computed(() => {
  return demandes.value.filter(d => {
    const typeOk = !typeSelectionne.value || d.typeStage === typeSelectionne.value
    const statutOk = d.statut === 'accepté'
    return typeOk && statutOk
  })
})

function filtrerType(type) {
  typeSelectionne.value = type
}
</script>
