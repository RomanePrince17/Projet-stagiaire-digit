<template>
  <div class="max-w-6xl mx-auto px-4 py-10 text-white">
    <h1 class="text-3xl font-bold mb-10 text-center">Demande de Stage</h1>

    <!-- Message de confirmation -->
    <div v-if="successMessage" class="text-green-500 font-semibold text-center mb-4">
      🎉 {{ successMessage }}
    </div>
    <div v-if="errorMessage" class="text-red-500 font-semibold text-center mb-4">
      ❌ {{ errorMessage }}
    </div>

    <!-- Sélecteur de type de stage -->
    <div class="mb-8 text-center">
      <label class="block mb-2 text-lg font-semibold text-gray-300">Type de stage</label>
      <select
        v-model="form.request_type"
        class="bg-[#2d2d2d] text-white border border-gray-600 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option disabled value="">-- Choisissez un type de stage --</option>
        <option value="academic">Stage Académique</option>
        <option value="professional">Stage Professionnel</option>
      </select>
    </div>

    <!-- Formulaire -->
    <form
      @submit.prevent="sendInternshipRequest"
      v-if="form.request_type"
      class="bg-[#1f1f1f] p-8 rounded-2xl shadow-xl border border-gray-700 space-y-8"
    >
      <h2 class="text-xl font-semibold text-center mb-4">
        Formulaire de Stage {{ form.request_type === 'academic' ? 'Académique' : 'Professionnel' }}
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label class="block mb-2 text-sm font-semibold text-gray-300">Domaine</label>
          <input
            v-model="form.domain"
            type="text"
            required
            placeholder="Ex: Développement backend"
            class="w-full px-4 py-2 rounded-md bg-[#2d2d2d] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block mb-2 text-sm font-semibold text-gray-300">Durée</label>
          <input
            v-model="form.duration"
            type="text"
            required
            placeholder="Ex: 3 mois"
            class="w-full px-4 py-2 rounded-md bg-[#2d2d2d] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block mb-2 text-sm font-semibold text-gray-300">Date de début</label>
          <input
            v-model="form.start_date"
            type="date"
            required
            class="w-full px-4 py-2 rounded-md bg-[#2d2d2d] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div class="text-center mt-6">
        <button
          type="submit"
          class="bg-[#6E38E0] hover:bg-[#5b2cd1] text-white font-semibold px-8 py-2 rounded-md transition duration-200"
        >
          Envoyer la demande
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  layout: 'default',
  title: 'Demande de stage',
  description: 'Page de soumission pour les demandes de stage',
})

const form = ref({
  request_type: '',
  domain: '',
  duration: '',
  start_date: ''
})

const successMessage = ref('')
const errorMessage = ref('')

const sendInternshipRequest = async () => {
  successMessage.value = ''
  errorMessage.value = ''

  const token = localStorage.getItem('auth_token')
  if (!token) {
    errorMessage.value = '⛔ Aucun token trouvé. Connectez-vous.'
    return
  }

  const payload = {
    request_type: form.value.request_type,
    domain: form.value.domain,
    duration: form.value.duration,
    start_date: form.value.start_date
  }

  try {
    const response = await fetch('https://digit-cursus-backend.onrender.com/api/demandes/internships/create/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })

    const result = await response.json()

   if (!response.ok) {
  console.error('❌ Erreur API :', result)
  // Montre tous les messages d'erreur du backend (souvent sous forme d'objet)
  const firstError = typeof result === 'object' ? Object.values(result)[0] : 'Erreur inconnue'
  errorMessage.value = `Erreur API : ${firstError}`
  return
}

    console.log('✅ Demande envoyée avec succès :', result)
    successMessage.value = 'Demande envoyée avec succès ! 🎉'
    resetForm()
  } catch (error) {
    console.error('❌ Erreur lors de l’envoi :', error)
    errorMessage.value = 'Une erreur est survenue.'
  }
}

const resetForm = () => {
  form.value = {
    request_type: '',
    domain: '',
    duration: '',
    start_date: ''
  }
}
</script>
