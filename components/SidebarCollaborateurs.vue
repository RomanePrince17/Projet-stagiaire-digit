<template>
  <div class="relative">
    <!-- Bouton Ajouter Collaborateur -->
    <button
      @click="showModal = true"
      :class="['flex gap-6 items-center px-4 py-2 text-black rounded transition', btnClass, textClass]"
    >
      <CollaboratorIcon class="w-5 h-5 text-2xl" />
       Collaborateur
    </button>

    <!-- Modal Création Collaborateur -->
    <transition name="fade">
      <div v-if="showModal" class="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
        <div :class="['bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-96', textClass]">
          <h2 class="text-xl font-bold mb-4">Créer un Collaborateur</h2>
          <form @submit.prevent="submitForm" class="space-y-4">
            <div>
              <label class="block mb-1">Nom d'utilisateur</label>
              <input v-model="form.username" type="text" required
                     class="w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"/>
            </div>
            <div>
              <label class="block mb-1">Email</label>
              <input v-model="form.email" type="email" required
                     class="w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"/>
            </div>
            <div>
              <label class="block mb-1">Mot de passe</label>
              <input v-model="form.password" type="password" required
                     class="w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"/>
            </div>
            <div class="flex justify-end gap-2">
              <button type="button" @click="showModal = false"
                      class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Annuler</button>
              <button type="submit" :disabled="loading"
                      class="px-4 py-2 rounded bg-indigo-600 text-white flex items-center gap-2 hover:bg-indigo-700">
                <svg v-if="loading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                     fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 010 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"></path>
                </svg>
                Créer
              </button>
            </div>
          </form>
          <p v-if="message" :class="messageSuccess ? ' bg-green-500 text-white mt-2' : 'bg-red-500 rounded-xl px-3 text-white mt-2'">{{ message }}</p>
          <!-- Toast -->

        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import CollaboratorIcon from '/components/icons/colaborateur.vue'
import { useRouter } from 'vue-router'

const props = defineProps<{ theme: string }>()

const showModal = ref(false)
const loading = ref(false)
const message = ref('')
const messageSuccess = ref(false)
const form = ref({ username: '', email: '', password: '' })

const textClass = computed(() => (props.theme === 'dark' ? 'text-white' : 'text-black'))
const btnClass = computed(() => (props.theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-200'))

const router = useRouter()

const submitForm = async () => {
  loading.value = true
  message.value = ''
  try {
    const token = localStorage.getItem('auth_token')
    if (!token) throw new Error('Token manquant')

    const res = await fetch('https://digit-cursus-backend.onrender.com/api/auth/collaborators/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(form.value)
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.detail || 'Erreur lors de la création')

    message.value = data.message
    messageSuccess.value = true

    form.value.username = ''
    form.value.email = ''
    form.value.password = ''

    setTimeout(() => {
      showModal.value = false
      router.push('/dashboard_entreprise/collaborateurs/list')
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
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
