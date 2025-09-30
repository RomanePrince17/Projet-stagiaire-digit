<template>
  <div class="relative">
    <!-- Bouton principal -->
    <button
      @click="showModal = true"
      :class="['flex items-center gap-4 px-4 py-3 w-full rounded-lg font-medium transition bg-indigo-600 text-white hover:bg-indigo-700']"
    >
      ➕
      <span>Créer un domaine</span>
    </button>

    <!-- Modal Création Domaine -->
    <transition name="fade">
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
      >
        <div :class="['bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-96', textClass]">
          <h2 class="text-xl font-bold mb-4">Créer un Domaine</h2>
          <form @submit.prevent="submitForm" class="space-y-4">
            <div>
              <label class="block mb-1">Nom du domaine</label>
              <input v-model="form.name" type="text" required
                class="w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"/>
            </div>
            <div>
              <label class="block mb-1">Description</label>
              <textarea v-model="form.description" rows="3" required
                class="w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"></textarea>
            </div>

            <div class="flex justify-end gap-2">
              <button type="button" @click="showModal = false"
                class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">
                Annuler
              </button>
              <button type="submit" :disabled="loading"
                class="px-4 py-2 rounded bg-indigo-600 text-white flex items-center gap-2 hover:bg-indigo-700">
                <svg v-if="loading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                  fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 010 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"/>
                </svg>
                Créer
              </button>
            </div>
          </form>

          <!-- Toast de notification -->
          <transition name="slide-fade">
            <div v-if="message"
              :class="[messageSuccess ? 'bg-green-500 text-white' : 'bg-red-500 text-white', 'mt-4 px-4 py-2 rounded shadow-md text-center']">
              {{ message }}
            </div>
          </transition>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{ theme: string }>()

const showModal = ref(false)
const loading = ref(false)
const message = ref('')
const messageSuccess = ref(false)
const form = ref({ name: '', description: '' })

const textClass = computed(() => props.theme === 'dark' ? 'text-white' : 'text-black')

const router = useRouter()

const submitForm = async () => {
  loading.value = true
  message.value = ''
  try {
    const token = localStorage.getItem('auth_token')
    if (!token) throw new Error('Token manquant')

    const res = await fetch('https://digit-cursus-backend.onrender.com/api/domaines/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(form.value)
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.detail || 'Erreur lors de la création')

    message.value = data.message || 'Domaine créé avec succès'
    messageSuccess.value = true

    form.value.name = ''
    form.value.description = ''

    setTimeout(() => {
      showModal.value = false
      router.push('/dashboard_entreprise/domaines/list')
    }, 1500)
  } catch (err: any) {
    message.value = err.message
    messageSuccess.value = false
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-fade-enter-active { transition: all 0.3s ease; }
.slide-fade-leave-active { transition: all 0.3s ease; }
.slide-fade-enter-from { transform: translateY(20px); opacity: 0; }
.slide-fade-leave-to { transform: translateY(20px); opacity: 0; }
</style>
