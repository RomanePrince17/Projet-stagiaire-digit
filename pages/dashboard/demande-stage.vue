<template>
  <div :class="['w-full mt-15 px-8 py-10 transition-colors', mainClass]">
    <h1 :class="['text-3xl font-bold mb-10 text-center', textClass]">
      Veuillez remplir ce formulaire
    </h1>
    <!-- Messages Modal -->
    <transition name="fade">
      <div
        v-if="showMessage"
        class="fixed inset-0 flex items-center justify-center bg-opacity-40 backdrop-blur-sm z-50 p-4"
      >
        <div
          :class="[
            'relative w-full max-w-md p-6 rounded-lg shadow-lg flex flex-col items-center text-center space-y-4 transition-colors',
            theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          ]"
        >
          <!-- Croix pour fermer -->
          <button
            @click="closeMessage"
            class="absolute top-3 right-3 text-xl font-bold hover:text-gray-500"
          >
            ×
          </button>

          <!-- Icône -->
          <div class="text-5xl">
            <span v-if="successMessage" class="text-green-500">✔️</span>
            <span v-else class="text-red-500">❌</span>
          </div>

          <!-- Message principal -->
          <p class="text-lg font-semibold break-words">
            {{ successMessage || errorMessage }}
          </p>

          <!-- Bouton OK -->
          <button
            @click="closeMessage"
            :class="[
              'mt-3 px-6 py-2 rounded-md font-semibold transition-colors',
              theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            ]"
          >
            OK
          </button>
        </div>
      </div>
    </transition>

    <!-- Type de stage -->
    <!-- <div class="mb-8 text-center max-w-xs mx-auto">
      <label :class="['block mb-2 text-lg font-semibold', textClass]"
        >Type de stage</label
      >
      <select
        v-model="form.request_type"
        :class="[
          'w-full px-4 py-2 rounded-md transition-colors appearance-none',
          mainClass,
          textClass,
          hoverClass
        ]"
      >
        <option
          disabled
          value=""
          :class="theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'"
        >
          -- Choisissez un type de stage --
        </option>
        <option
          value="academic"
          :class="theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'"
        >
          Stage Académique
        </option>
        <option
          value="professional"
          :class="theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'"
        >
          Stage Professionnel
        </option>
      </select>
    </div> -->

    <!-- Formulaire toujours visible (par défaut académique) -->
     <!-- Formulaire -->
    <form
      @submit.prevent="sendInternshipRequest"
      class="p-8 rounded-2xl shadow-lg space-y-8  dark:bg-white text-gray-900 dark:text-white"
    >
      <!-- Type de stage -->
      <div class="mb-6 max-w-xs mx-auto">
        <label class="block mb-2 text-lg text-center font-semibold">Type de stage</label>
        <select
          v-model="form.request_type"
          class="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option disabled value="">-- Choisissez un type de stage --</option>
          <option value="academic">Stage Académique</option>
          <option value="professional">Stage Professionnel</option>
        </select>
      </div>
      <!-- Champs principaux -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label class="block mb-2 text-sm font-semibold">Domaine</label>
          <select
            v-model="form.domain"
            required
            class="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option disabled value="">-- Choisissez un domaine --</option>
            <option value="UI">UI/UX</option>
            <option value="Front">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Fullstack">Fullstack</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>

        <div>
          <label class="block mb-2 text-sm font-semibold">Durée</label>
          <select
            v-model="form.duration"
            required
            class="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option disabled value="">-- Choisissez une durée --</option>
            <option value="3 months">3 months</option>
            <option value="6 months">6 months</option>
          </select>
        </div>

        <div>
          <label class="block mb-2 text-sm font-semibold">Date de début</label>
          <input
            type="date"
            v-model="form.start_date"
            required
            class="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <!-- Lettre académique -->
      <div v-if="form.request_type === 'academic'">
        <label class="block mb-2 text-sm font-semibold">Lettre de recommandation</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          required
          @change="e => form.recommendation_letter = e.target.files[0]"
          class="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      <!-- Lettre professionnelle -->
      <div v-if="form.request_type === 'professional'">
        <label class="block mb-2 text-sm font-semibold">Lettre de demande</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          required
          @change="e => form.demand_letter = e.target.files[0]"
          class="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      <!-- Bouton d'envoi -->
      <div class="text-center mt-6">
        <button
          type="submit"
          :disabled="loading"
          class="px-8 py-2 rounded-md font-semibold bg-[#7B49E5] text-white hover:from-[#e04e24] hover:to-[#5a2fc4] transition duration-200 flex items-center justify-center gap-2"
        >
          <svg
            v-if="loading"
            class="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"/>
            <path fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" class="opacity-75"/>
          </svg>
          <span>{{ loading ? 'Envoi en cours…' : 'Envoyer la demande' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>


<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  layout: 'default',
  title: 'Demande de stage',
  description: 'Soumettez votre demande de stage',
})

// Formulaire (par défaut académique)
const form = ref({
  request_type: 'academic',
  domain: '',
  duration: '',
  start_date: '',
  recommendation_letter: null as File | null,
  demand_letter: null as File | null
})

const theme = ref('light')

// On récupère le thème côté client seulement
onMounted(() => {
  theme.value = localStorage.getItem('theme') || 'light'
})

const buttonClass = computed(() =>
  theme.value === 'dark'
    ? 'bg-indigo-400 text-black'
    : 'bg-indigo-600 text-white'
)

const buttonHoverClass = computed(() =>
  theme.value === 'dark' ? 'hover:bg-indigo-300' : 'hover:bg-indigo-700'
)

// Messages
const successMessage = ref('')
const errorMessage = ref('')
const showMessage = ref(false)
let messageTimeout: number | undefined

const closeMessage = () => {
  showMessage.value = false
  clearTimeout(messageTimeout)
}

const loading = ref(false)

// Envoi du formulaire
const sendInternshipRequest = async () => {
  loading.value = true
  successMessage.value = ''
  errorMessage.value = ''
  showMessage.value = false
  clearTimeout(messageTimeout)

  const token = localStorage.getItem('auth_token')
  if (!token) {
    errorMessage.value = '⛔ Aucun token trouvé. Veuillez vous connecter.'
    showMessage.value = true
    messageTimeout = window.setTimeout(closeMessage, 3000)
    loading.value = false
    return
  }

  const formData = new FormData()
  formData.append('request_type', form.value.request_type)
  formData.append('domain', form.value.domain)
  formData.append('duration', form.value.duration)
  formData.append('start_date', form.value.start_date)

  if (form.value.request_type === 'academic' && form.value.recommendation_letter) {
    formData.append('recommendation_letter', form.value.recommendation_letter)
  }
  if (form.value.request_type === 'professional' && form.value.demand_letter) {
    formData.append('demand_letter', form.value.demand_letter)
  }

  try {
    const response = await fetch(
      'https://digit-cursus-backend.onrender.com/api/demandes/internships/create/',
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      }
    )

    const result = await response.json()
    if (!response.ok) {
      const firstError =
        typeof result === 'object' ? Object.values(result)[0] : 'Erreur inconnue'
      errorMessage.value = `Erreur : ${firstError}`
      showMessage.value = true
      messageTimeout = window.setTimeout(closeMessage, 4000)
      loading.value = false
      return
    }

    successMessage.value = 'Demande envoyée avec succès'
    showMessage.value = true
    messageTimeout = window.setTimeout(closeMessage, 3000)
    resetForm()
  } catch (err) {
    errorMessage.value = 'Une erreur est survenue lors de l’envoi.'
    showMessage.value = true
    messageTimeout = window.setTimeout(closeMessage, 3000)
    console.error('❌ Erreur :', err)
  } finally {
    loading.value = false
  }
}

// Reset du formulaire
const resetForm = () => {
  form.value = {
    request_type: 'academic', // par défaut toujours académique
    domain: '',
    duration: '',
    start_date: '',
    recommendation_letter: null,
    demand_letter: null
  }
}
</script>

<style scoped>
/* Fade animation pour le modal */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
