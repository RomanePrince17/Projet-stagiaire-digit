<template>
  <div class="min-h-screen bg-[#111827] text-white">
    <!-- En-tête -->
    <header class="flex items-center gap-6 mb-10">
      <img
        :src="profil.photo || 'https://via.placeholder.com/150'"
        alt="Photo de profil"
        class="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
      />
      <div>
        <h1 class="text-3xl font-bold">{{ profil.first_name }} {{ profil.last_name }}</h1>
        <p class="text-gray-400 text-sm">{{ profil.quartier }}</p>
      </div>
    </header>

    <!-- Informations personnelles et professionnelles -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Informations personnelles -->
      <section class="bg-[#1f2937] rounded-lg p-6 shadow-md">
        <h2 class="text-xl font-semibold mb-4">Informations personnelles</h2>
        <ul class="space-y-3 text-sm text-gray-300">
          <li><span class="font-semibold text-white">Nom :</span> {{ profil.last_name }}</li>
          <li><span class="font-semibold text-white">Prénom :</span> {{ profil.first_name }}</li>
          <li><span class="font-semibold text-white">Âge :</span> {{ profil.age }} ans</li>
          <li><span class="font-semibold text-white">Sexe :</span> {{ profil.sex }}</li>
          <li><span class="font-semibold text-white">Téléphone :</span> {{ profil.phone_number }}</li>
          <li><span class="font-semibold text-white">Localisation :</span> {{ profil.quartier }}</li>
        </ul>
      </section>

      <!-- Informations professionnelles -->
      <section class="bg-[#1f2937] rounded-lg p-6 shadow-md">
        <h2 class="text-xl font-semibold mb-4">Profil professionnel</h2>
        <ul class="space-y-3 text-sm text-gray-300">
          <li><span class="font-semibold text-white">École :</span> {{ profil.ecole }}</li>
          <li><span class="font-semibold text-white">Niveau :</span> {{ profil.niveau }}</li>
          <li><span class="font-semibold text-white">Expérience :</span> {{ profil.experience }}</li>
          <li>
            <span class="font-semibold text-white">Compétences :</span>
            {{ profil.competences?.join(', ') || 'Non spécifiées' }}
          </li>
          <li v-if="profil.cv">
            <span class="font-semibold text-white">CV :</span>
            <a :href="profil.cv" target="_blank" class="text-blue-400 hover:underline">Voir le CV</a>
          </li>
        </ul>
      </section>
    </div>

    <!-- Actions -->
    <div class="mt-10 flex gap-4">
      <button @click="modifierProfil" class="bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded font-semibold">
        Modifier mon profil
      </button>
      <button @click="telechargerCV" class="bg-gray-700 hover:bg-gray-800 py-2 px-4 rounded font-semibold">
        Télécharger le CV
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Profil {
  first_name: string
  last_name: string
  age: number
  sex: string
  phone_number: string
  quartier: string
  photo?: string
  ecole?: string
  niveau?: string
  experience?: string
  competences?: string[]
  cv?: string
}

const profil = ref<Profil>({
  first_name: '',
  last_name: '',
  age: 0,
  sex: '',
  phone_number: '',
  quartier: '',
  photo: '',
  ecole: '',
  niveau: '',
  experience: '',
  competences: [],
  cv: ''
})

// Fonction qui vérifie si le token est présent avant de lancer l'appel API
async function attendreEtChargerProfil() {
  let token = localStorage.getItem('auth_token')

  // 🔁 Attente active jusqu'à ce que le token soit trouvé (max 5 tentatives)
  let tentatives = 0
  while (!token && tentatives < 5) {
    console.warn('Token introuvable... nouvelle tentative...')
    await new Promise(resolve => setTimeout(resolve, 500)) // attendre 500ms
    token = localStorage.getItem('token')
    tentatives++
  }

  if (!token) {
    console.error("Token toujours introuvable après plusieurs tentatives.")
    return
  }

  fetchProfil(token)
}

async function fetchProfil(token: string) {
  try {
    console.log('Token utilisé pour appel API :', token)

    const response = await fetch('https://digit-cursus-backend.onrender.com/api/profiles/personal/', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`)
    }

    const data = await response.json()
    console.log('Données reçues :', data)

    profil.value = data // ou data.profil si c’est encapsulé

  } catch (error) {
    console.error('Erreur lors du chargement du profil :', error)
  }
}

onMounted(() => {
  attendreEtChargerProfil()
})

function modifierProfil() {
  alert('Rediriger vers le formulaire de modification du profil.')
}

function telechargerCV() {
  if (profil.value.cv) {
    window.open(profil.value.cv, '_blank')
  } else {
    alert('Aucun CV disponible.')
  }
}
</script>
